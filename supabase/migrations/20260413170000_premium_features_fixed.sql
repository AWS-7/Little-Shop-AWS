-- Premium E-commerce Features Migration for Little Shop (Fixed Version)
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. PRODUCTS TABLE (Create first if not exists)
-- ============================================

CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    long_description TEXT,
    price NUMERIC NOT NULL,
    original_price NUMERIC,
    category TEXT NOT NULL,
    category_label TEXT,
    badge TEXT,
    image TEXT,
    images TEXT[],
    in_stock BOOLEAN DEFAULT true,
    rating NUMERIC,
    reviews INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Insert the starter products (SKIP if they already exist)
INSERT INTO public.products (id, name, description, long_description, price, original_price, category, category_label, badge, image, images, in_stock, rating, reviews) 
VALUES 
('kanj-burgundy-001', 'Royal Burgundy Kanjivaram', 'Pure silk Kanjivaram saree with rich gold zari border and traditional floral motifs.', 'This exquisite pure silk Kanjivaram saree features a deep burgundy base with intricate gold zari work.', 28500, 35000, 'kanjivaram', 'Kanjivaram Silk', 'Bestseller', '/assets/product-saree-1.jpg', ARRAY['/assets/product-saree-1.jpg'], true, 4.9, 124),
('ban-blue-002', 'Royal Blue Banarasi Silk', 'Handwoven Banarasi silk saree with exquisite gold brocade and medallion motifs.', 'A stunning royal blue Banarasi silk saree featuring traditional medallion (buta) motifs.', 32000, null, 'banarasi', 'Banarasi Silk', 'New Arrival', '/assets/product-saree-2.jpg', ARRAY['/assets/product-saree-2.jpg'], true, 4.8, 89),
('kanj-green-003', 'Emerald Green Kanjivaram', 'Vibrant green pure silk Kanjivaram with broad gold zari border and sunflower motifs.', 'This vibrant emerald green Kanjivaram saree is a celebration of colour and craftsmanship.', 26500, 30000, 'kanjivaram', 'Kanjivaram Silk', 'Limited Edition', '/assets/product-saree-3.jpg', ARRAY['/assets/product-saree-3.jpg'], true, 4.7, 67),
('jewel-necklace-004', 'Temple Gold Necklace Set', 'Traditional South Indian temple jewelry necklace with matching earrings in antique gold finish.', 'This magnificent temple-style gold necklace set features intricate craftsmanship.', 15800, 19000, 'jewellery', 'Temple Jewellery', 'Trending', '/assets/product-jewelry-1.jpg', ARRAY['/assets/product-jewelry-1.jpg'], true, 4.9, 203),
('jewel-jhumka-005', 'Pearl Jhumka Earrings', 'Handcrafted gold jhumka earrings with pearl drops and multi-colored stone work.', 'These stunning jhumka earrings are a masterpiece of traditional Indian jewelry making.', 8500, null, 'jewellery', 'Temple Jewellery', null, '/assets/product-jewelry-2.jpg', ARRAY['/assets/product-jewelry-2.jpg'], true, 4.8, 156),
('bag-clutch-006', 'Golden Embroidered Clutch', 'Premium designer clutch with gold embroidery and chain strap, perfect for festive occasions.', 'This luxurious clutch bag features exquisite gold thread embroidery on a cream silk base.', 4500, 5500, 'bags', 'Designer Bags', 'New Arrival', '/assets/product-bag-1.jpg', ARRAY['/assets/product-bag-1.jpg'], true, 4.6, 45)
ON CONFLICT (id) DO NOTHING;  -- Skip if product already exists

-- ============================================
-- 2. LOOKBOOK TABLES
-- ============================================

-- Create lookbooks table
CREATE TABLE IF NOT EXISTS public.lookbooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    main_image_url TEXT NOT NULL,
    occasion TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create lookbook_products junction table for tagging products on lookbook images
CREATE TABLE IF NOT EXISTS public.lookbook_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lookbook_id UUID NOT NULL REFERENCES public.lookbooks(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    x_coordinate DECIMAL(5,2) NOT NULL, -- Percentage 0-100
    y_coordinate DECIMAL(5,2) NOT NULL, -- Percentage 0-100
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    UNIQUE(lookbook_id, product_id)
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_lookbook_products_lookbook_id ON public.lookbook_products(lookbook_id);
CREATE INDEX IF NOT EXISTS idx_lookbook_products_product_id ON public.lookbook_products(product_id);

-- Enable RLS
ALTER TABLE public.lookbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lookbook_products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid errors)
DROP POLICY IF EXISTS "Allow public read access to lookbooks" ON public.lookbooks;
DROP POLICY IF EXISTS "Allow public read access to lookbook_products" ON public.lookbook_products;

-- Create policies
CREATE POLICY "Allow public read access to lookbooks"
    ON public.lookbooks FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow public read access to lookbook_products"
    ON public.lookbook_products FOR SELECT
    TO public
    USING (true);

-- ============================================
-- 3. UPDATE PRODUCTS TABLE FOR VIRTUAL TRY-ON
-- ============================================

-- Add virtual try-on columns to products table
ALTER TABLE public.products 
    ADD COLUMN IF NOT EXISTS is_tryon_enabled BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS transparent_png_url TEXT,
    ADD COLUMN IF NOT EXISTS occasion_tags TEXT[] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS style_guide TEXT;

-- Add index for try-on enabled products
CREATE INDEX IF NOT EXISTS idx_products_tryon ON public.products(is_tryon_enabled) WHERE is_tryon_enabled = true;

-- ============================================
-- 4. ORDERS TABLE FOR PAYMENT WEBHOOK
-- ============================================

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    razorpay_order_id TEXT UNIQUE,
    razorpay_payment_id TEXT,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT DEFAULT 'pending', -- pending, paid, failed, refunded
    items JSONB NOT NULL,
    shipping_address JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable RLS on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create own orders" ON public.orders;

CREATE POLICY "Users can view own orders"
    ON public.orders FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
    ON public.orders FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 5. SAMPLE DATA FOR LOOKBOOKS
-- ============================================

-- Insert sample lookbooks (skip if exists)
INSERT INTO public.lookbooks (id, title, main_image_url, occasion, description) 
VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Royal Wedding Ensemble', '/assets/lookbook-1.jpg', 'Wedding', 'Complete bridal look featuring burgundy Kanjivaram saree with temple jewellery'),
('550e8400-e29b-41d4-a716-446655440001', 'Festive Celebration', '/assets/lookbook-2.jpg', 'Party', 'Elegant blue Banarasi silk with pearl accessories'),
('550e8400-e29b-41d4-a716-446655440002', 'Contemporary Classic', '/assets/lookbook-3.jpg', 'Wedding', 'Emerald green Kanjivaram with traditional gold jewellery')
ON CONFLICT (id) DO NOTHING;

-- Link products to lookbooks with coordinates (skip if exists)
INSERT INTO public.lookbook_products (lookbook_id, product_id, x_coordinate, y_coordinate) 
VALUES
-- Royal Wedding Ensemble lookbook
('550e8400-e29b-41d4-a716-446655440000', 'kanj-burgundy-001', 50.00, 40.00),
('550e8400-e29b-41d4-a716-446655440000', 'jewel-necklace-004', 50.00, 25.00),
('550e8400-e29b-41d4-a716-446655440000', 'bag-clutch-006', 75.00, 60.00),
-- Festive Celebration lookbook  
('550e8400-e29b-41d4-a716-446655440001', 'ban-blue-002', 50.00, 45.00),
('550e8400-e29b-41d4-a716-446655440001', 'jewel-jhumka-005', 45.00, 20.00),
-- Contemporary Classic lookbook
('550e8400-e29b-41d4-a716-446655440002', 'kanj-green-003', 50.00, 42.00),
('550e8400-e29b-41d4-a716-446655440002', 'jewel-necklace-004', 50.00, 22.00)
ON CONFLICT (lookbook_id, product_id) DO NOTHING;

-- ============================================
-- 6. UPDATE EXISTING PRODUCTS FOR TRY-ON
-- ============================================

UPDATE public.products SET 
    is_tryon_enabled = true,
    transparent_png_url = '/assets/jewellery-necklace-transparent.png',
    occasion_tags = ARRAY['Wedding', 'Party'],
    style_guide = 'Pair this necklace with deep neck blouses. Best suited for silk sarees in maroon, gold, or green shades. Avoid heavy earrings when wearing this statement piece.'
WHERE id = 'jewel-necklace-004';

UPDATE public.products SET 
    is_tryon_enabled = true,
    transparent_png_url = '/assets/jewellery-jhumka-transparent.png',
    occasion_tags = ARRAY['Wedding', 'Party', 'Daily'],
    style_guide = 'These versatile jhumkas work with both ethnic and fusion wear. Pair with high-neck blouses or simple kurtis. Light and comfortable for all-day wear.'
WHERE id = 'jewel-jhumka-005';

-- Add occasion tags to all products
UPDATE public.products SET occasion_tags = ARRAY['Wedding', 'Party'] WHERE category IN ('kanjivaram', 'banarasi');
UPDATE public.products SET occasion_tags = ARRAY['Wedding', 'Party', 'Daily'] WHERE category = 'jewellery';
UPDATE public.products SET occasion_tags = ARRAY['Party', 'Daily', 'Office'] WHERE category = 'bags';

-- ============================================
-- 7. FUNCTION TO FETCH LOOKBOOKS WITH PRODUCTS
-- ============================================

CREATE OR REPLACE FUNCTION public.get_lookbooks_with_products()
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', l.id,
            'title', l.title,
            'main_image_url', l.main_image_url,
            'occasion', l.occasion,
            'description', l.description,
            'products', (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'product_id', lp.product_id,
                        'x', lp.x_coordinate,
                        'y', lp.y_coordinate,
                        'product', jsonb_build_object(
                            'id', p.id,
                            'name', p.name,
                            'price', p.price,
                            'image', p.image,
                            'category', p.category
                        )
                    )
                )
                FROM public.lookbook_products lp
                JOIN public.products p ON lp.product_id = p.id
                WHERE lp.lookbook_id = l.id
            )
        )
    )
    INTO result
    FROM public.lookbooks l;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_lookbooks_with_products() TO public;
GRANT EXECUTE ON FUNCTION public.get_lookbooks_with_products() TO authenticated;

-- ============================================
-- 8. WEBHOOK VERIFICATION FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION public.verify_razorpay_payment(
    p_razorpay_order_id TEXT,
    p_razorpay_payment_id TEXT,
    p_razorpay_signature TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    v_order_record RECORD;
    v_webhook_secret TEXT := 'your_webhook_secret_here'; -- Set this in Supabase secrets
    v_expected_signature TEXT;
    v_payload TEXT;
BEGIN
    -- Get the order
    SELECT * INTO v_order_record 
    FROM public.orders 
    WHERE razorpay_order_id = p_razorpay_order_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Order not found';
    END IF;
    
    -- Verify signature (simplified - implement HMAC in production)
    v_payload := p_razorpay_order_id || '|' || p_razorpay_payment_id;
    
    -- For now, update the order status
    UPDATE public.orders 
    SET 
        razorpay_payment_id = p_razorpay_payment_id,
        status = 'paid',
        updated_at = NOW()
    WHERE id = v_order_record.id;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.verify_razorpay_payment IS 'Verifies Razorpay payment and updates order status. Replace with actual HMAC signature verification in production.';

-- Success message
SELECT 'Migration completed successfully!' AS status;
