-- Migration: Add Lookbook and Virtual Try-On features with Payment tracking

-- ============================================
-- LOOKBOOK TABLES
-- ============================================

-- Create lookbooks table
CREATE TABLE public.lookbooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  main_image_url TEXT NOT NULL,
  occasion TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on lookbooks
ALTER TABLE public.lookbooks ENABLE ROW LEVEL SECURITY;

-- Everyone can view lookbooks
CREATE POLICY "Anyone can view lookbooks" ON public.lookbooks FOR SELECT USING (true);

-- Only admins can modify lookbooks
CREATE POLICY "Only admins can insert lookbooks" ON public.lookbooks FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND email LIKE '%@admin%')
);
CREATE POLICY "Only admins can update lookbooks" ON public.lookbooks FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND email LIKE '%@admin%')
);
CREATE POLICY "Only admins can delete lookbooks" ON public.lookbooks FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND email LIKE '%@admin%')
);

-- Create lookbook_products junction table with hotspot coordinates
CREATE TABLE public.lookbook_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lookbook_id UUID REFERENCES public.lookbooks(id) ON DELETE CASCADE NOT NULL,
  product_id TEXT NOT NULL,
  x_coordinate NUMERIC NOT NULL DEFAULT 50 CHECK (x_coordinate >= 0 AND x_coordinate <= 100),
  y_coordinate NUMERIC NOT NULL DEFAULT 50 CHECK (y_coordinate >= 0 AND y_coordinate <= 100),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on lookbook_products
ALTER TABLE public.lookbook_products ENABLE ROW LEVEL SECURITY;

-- Everyone can view linked products
CREATE POLICY "Anyone can view lookbook products" ON public.lookbook_products FOR SELECT USING (true);

-- Only admins can modify lookbook_products
CREATE POLICY "Only admins can insert lookbook products" ON public.lookbook_products FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND email LIKE '%@admin%')
);
CREATE POLICY "Only admins can update lookbook products" ON public.lookbook_products FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND email LIKE '%@admin%')
);
CREATE POLICY "Only admins can delete lookbook products" ON public.lookbook_products FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND email LIKE '%@admin%')
);

-- Create index for faster lookups
CREATE INDEX idx_lookbook_products_lookbook_id ON public.lookbook_products(lookbook_id);

-- ============================================
-- PRODUCTS TABLE UPDATES
-- ============================================

-- Add Virtual Try-On columns to products table (if products table exists)
-- Note: In a real migration, check if products table exists first

-- Create enum for occasions if not exists
DO $$ BEGIN
  CREATE TYPE public.occasion_type AS ENUM ('wedding', 'party', 'daily', 'office');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- PAYMENTS TABLE
-- ============================================

-- Create payments table for Razorpay integration
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  razorpay_payment_id TEXT,
  razorpay_order_id TEXT,
  razorpay_signature TEXT,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Users can view their own payment records
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = payments.order_id AND orders.user_id = auth.uid())
);

-- System can insert payments
CREATE POLICY "System can insert payments" ON public.payments FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = payments.order_id)
);

-- System can update payments (for webhooks)
CREATE POLICY "System can update payments" ON public.payments FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = payments.order_id)
);

-- Create indexes for payment lookups
CREATE INDEX idx_payments_order_id ON public.payments(order_id);
CREATE INDEX idx_payments_razorpay_payment_id ON public.payments(razorpay_payment_id);
CREATE INDEX idx_payments_razorpay_order_id ON public.payments(razorpay_order_id);

-- ============================================
-- TRIGGERS
-- ============================================

-- Update timestamp trigger for lookbooks
CREATE TRIGGER update_lookbooks_updated_at BEFORE UPDATE ON public.lookbooks 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Update timestamp trigger for payments
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to get lookbook with linked products
CREATE OR REPLACE FUNCTION public.get_lookbook_with_products(lookbook_uuid UUID)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'lookbook', to_jsonb(l.*),
    'linked_products', COALESCE(
      (SELECT jsonb_agg(
        jsonb_build_object(
          'id', lp.id,
          'product_id', lp.product_id,
          'x_coordinate', lp.x_coordinate,
          'y_coordinate', lp.y_coordinate,
          'created_at', lp.created_at
        )
      )
      FROM public.lookbook_products lp
      WHERE lp.lookbook_id = l.id
      ),
      '[]'::jsonb
    )
  )
  INTO result
  FROM public.lookbooks l
  WHERE l.id = lookbook_uuid;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle Razorpay webhook and update order status
CREATE OR REPLACE FUNCTION public.handle_razorpay_webhook(
  p_razorpay_payment_id TEXT,
  p_razorpay_order_id TEXT,
  p_event TEXT
)
RETURNS JSONB AS $$
DECLARE
  v_payment_id UUID;
  v_order_id UUID;
  v_new_status TEXT;
  v_order_status TEXT;
  result JSONB;
BEGIN
  -- Find payment by Razorpay order ID
  SELECT p.id, p.order_id INTO v_payment_id, v_order_id
  FROM public.payments p
  WHERE p.razorpay_order_id = p_razorpay_order_id;
  
  IF v_payment_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Payment not found');
  END IF;
  
  -- Determine new status based on event
  CASE p_event
    WHEN 'payment.captured' THEN
      v_new_status := 'captured';
      v_order_status := 'processing';
    WHEN 'payment.failed' THEN
      v_new_status := 'failed';
      v_order_status := 'cancelled';
    WHEN 'refund.processed' THEN
      v_new_status := 'refunded';
      v_order_status := 'cancelled';
    ELSE
      RETURN jsonb_build_object('success', false, 'error', 'Unknown event type');
  END CASE;
  
  -- Update payment
  UPDATE public.payments
  SET 
    status = v_new_status,
    razorpay_payment_id = p_razorpay_payment_id,
    updated_at = now()
  WHERE id = v_payment_id;
  
  -- Update order
  UPDATE public.orders
  SET 
    status = v_order_status,
    updated_at = now()
  WHERE id = v_order_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'payment_id', v_payment_id,
    'order_id', v_order_id,
    'status', v_new_status
  );
  
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_lookbook_with_products TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_razorpay_webhook TO service_role;
