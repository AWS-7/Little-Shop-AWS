// Supabase Edge Function: POST /verify-payment
// Handles Razorpay webhook for payment verification

// @ts-types="https://esm.sh/@supabase/supabase-js@2/dist/module/index.d.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-razorpay-signature',
};

// Verify Razorpay webhook signature
function verifyWebhookSignature(body: string, signature: string, secret: string): boolean {
  try {
    const crypto = (globalThis as any).crypto;
    const encoder = new TextEncoder();
    
    // Convert secret to key
    const keyData = encoder.encode(secret);
    
    return crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    ).then(async (key: CryptoKey) => {
      const signatureBuffer = await crypto.subtle.sign(
        'HMAC',
        key,
        encoder.encode(body)
      );
      
      const computedSignature = Array.from(new Uint8Array(signatureBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      
      return computedSignature === signature;
    });
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405,
      }
    );
  }

  try {
    const signature = req.headers.get('x-razorpay-signature');
    const webhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET');
    
    if (!webhookSecret) {
      throw new Error('Razorpay webhook secret not configured');
    }

    // Read request body
    const body = await req.text();
    
    // Verify signature if present
    if (signature) {
      const isValid = await verifyWebhookSignature(body, signature, webhookSecret);
      if (!isValid) {
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid signature' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 401,
          }
        );
      }
    }

    // Parse webhook payload
    const payload = JSON.parse(body);
    const event = payload.event;
    const paymentEntity = payload.payload?.payment?.entity;

    if (!paymentEntity) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid payload' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    const razorpayPaymentId = paymentEntity.id;
    const razorpayOrderId = paymentEntity.order_id;

    // Create Supabase client with service role for database updates
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Find payment record by Razorpay order ID
    const { data: paymentRecord, error: findError } = await supabaseClient
      .from('payments')
      .select('*, orders!inner(user_id)')
      .eq('razorpay_order_id', razorpayOrderId)
      .single();

    if (findError || !paymentRecord) {
      console.error('Payment record not found:', findError);
      return new Response(
        JSON.stringify({ success: false, error: 'Payment record not found' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      );
    }

    let newStatus: string;
    let orderStatus: string;

    // Determine status based on event type
    switch (event) {
      case 'payment.captured':
        newStatus = 'captured';
        orderStatus = 'processing';
        break;
      case 'payment.failed':
        newStatus = 'failed';
        orderStatus = 'cancelled';
        break;
      case 'refund.processed':
        newStatus = 'refunded';
        orderStatus = 'cancelled';
        break;
      case 'refund.failed':
        newStatus = 'refund_failed';
        orderStatus = 'processing';
        break;
      default:
        return new Response(
          JSON.stringify({ success: false, error: 'Unknown event type' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        );
    }

    // Update payment record
    const { error: paymentError } = await supabaseClient
      .from('payments')
      .update({
        status: newStatus,
        razorpay_payment_id: razorpayPaymentId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', paymentRecord.id);

    if (paymentError) {
      console.error('Error updating payment:', paymentError);
      throw new Error('Failed to update payment');
    }

    // Update order status
    const { error: orderError } = await supabaseClient
      .from('orders')
      .update({
        status: orderStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', paymentRecord.order_id);

    if (orderError) {
      console.error('Error updating order:', orderError);
      throw new Error('Failed to update order');
    }

    // Send notification to user (optional - can be implemented with Supabase Realtime)
    const { error: notifyError } = await supabaseClient
      .from('notifications')
      .insert({
        user_id: paymentRecord.orders.user_id,
        type: 'payment_update',
        title: `Payment ${newStatus}`,
        message: `Your payment for order #${paymentRecord.order_id} has been ${newStatus}.`,
        data: {
          order_id: paymentRecord.order_id,
          payment_id: paymentRecord.id,
          status: newStatus,
        },
      });

    if (notifyError) {
      console.error('Error creating notification:', notifyError);
      // Don't throw here - notification failure shouldn't fail the webhook
    }

    return new Response(
      JSON.stringify({
        success: true,
        payment_id: paymentRecord.id,
        order_id: paymentRecord.order_id,
        status: newStatus,
        event: event,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in verify-payment webhook:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
