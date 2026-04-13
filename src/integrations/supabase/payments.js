import { supabase } from './client';

/**
 * Create a new payment record
 * @param {Object} paymentData
 * @param {string} paymentData.order_id
 * @param {number} paymentData.amount
 * @param {string} paymentData.currency - default 'INR'
 * @returns {Promise<Object|null>}
 */
export const createPayment = async (paymentData) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .insert([{
        order_id: paymentData.order_id,
        amount: paymentData.amount,
        currency: paymentData.currency || 'INR',
        status: 'pending',
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating payment:', error);
    return null;
  }
};

/**
 * Update payment with Razorpay details
 * @param {string} paymentId - Internal payment ID
 * @param {Object} razorpayData
 * @param {string} razorpayData.razorpay_payment_id
 * @param {string} razorpayData.razorpay_order_id
 * @param {string} razorpayData.razorpay_signature
 * @returns {Promise<boolean>}
 */
export const updatePaymentWithRazorpay = async (paymentId, razorpayData) => {
  try {
    const { error } = await supabase
      .from('payments')
      .update({
        razorpay_payment_id: razorpayData.razorpay_payment_id,
        razorpay_order_id: razorpayData.razorpay_order_id,
        razorpay_signature: razorpayData.razorpay_signature,
        status: 'processing',
        updated_at: new Date().toISOString(),
      })
      .eq('id', paymentId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating payment:', error);
    return false;
  }
};

/**
 * Verify Razorpay webhook signature
 * @param {string} webhookBody - Raw request body
 * @param {string} signature - X-Razorpay-Signature header
 * @param {string} secret - Razorpay webhook secret
 * @returns {boolean}
 */
export const verifyRazorpayWebhook = (webhookBody, signature, secret) => {
  try {
    const crypto = window.crypto || window.msCrypto;
    const encoder = new TextEncoder();
    
    // Use SubtleCrypto for HMAC-SHA256
    const verify = async () => {
      const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );
      
      const signatureBuffer = await crypto.subtle.sign(
        'HMAC',
        key,
        encoder.encode(webhookBody)
      );
      
      const computedSignature = Array.from(new Uint8Array(signatureBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      
      return computedSignature === signature;
    };
    
    // For Node.js environment, use crypto module
    if (typeof window === 'undefined') {
      const nodeCrypto = require('crypto');
      const computedSignature = nodeCrypto
        .createHmac('sha256', secret)
        .update(webhookBody)
        .digest('hex');
      return computedSignature === signature;
    }
    
    return verify();
  } catch (error) {
    console.error('Error verifying webhook:', error);
    return false;
  }
};

/**
 * Handle Razorpay webhook payload
 * @param {Object} payload - Razorpay webhook payload
 * @returns {Promise<Object>} Result of processing
 */
export const handleRazorpayWebhook = async (payload) => {
  try {
    const event = payload.event;
    const paymentEntity = payload.payload?.payment?.entity;
    
    if (!paymentEntity) {
      return { success: false, error: 'Invalid payload' };
    }

    const razorpayPaymentId = paymentEntity.id;
    const razorpayOrderId = paymentEntity.order_id;
    const status = paymentEntity.status;

    // Find payment record by Razorpay order ID
    const { data: paymentRecord, error: findError } = await supabase
      .from('payments')
      .select('*')
      .eq('razorpay_order_id', razorpayOrderId)
      .single();

    if (findError || !paymentRecord) {
      return { success: false, error: 'Payment record not found' };
    }

    let newStatus;
    let orderStatus;

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
      default:
        return { success: false, error: 'Unknown event type' };
    }

    // Update payment status
    const { error: paymentError } = await supabase
      .from('payments')
      .update({
        status: newStatus,
        razorpay_payment_id: razorpayPaymentId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', paymentRecord.id);

    if (paymentError) {
      return { success: false, error: 'Failed to update payment' };
    }

    // Update associated order status
    const { error: orderError } = await supabase
      .from('orders')
      .update({
        status: orderStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', paymentRecord.order_id);

    if (orderError) {
      return { success: false, error: 'Failed to update order' };
    }

    return {
      success: true,
      payment_id: paymentRecord.id,
      order_id: paymentRecord.order_id,
      status: newStatus,
    };
  } catch (error) {
    console.error('Error handling webhook:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get payment by order ID
 * @param {string} orderId
 * @returns {Promise<Object|null>}
 */
export const getPaymentByOrderId = async (orderId) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching payment:', error);
    return null;
  }
};

/**
 * Get payment by Razorpay payment ID
 * @param {string} razorpayPaymentId
 * @returns {Promise<Object|null>}
 */
export const getPaymentByRazorpayId = async (razorpayPaymentId) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('razorpay_payment_id', razorpayPaymentId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching payment:', error);
    return null;
  }
};

/**
 * Initiate Razorpay refund
 * @param {string} paymentId - Internal payment ID
 * @param {number} amount - Amount to refund (in paise)
 * @param {string} reason - Refund reason
 * @returns {Promise<Object|null>}
 */
export const initiateRefund = async (paymentId, amount, reason) => {
  try {
    // Get payment details
    const { data: payment, error: fetchError } = await supabase
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single();

    if (fetchError || !payment) {
      throw new Error('Payment not found');
    }

    if (!payment.razorpay_payment_id) {
      throw new Error('Razorpay payment ID not found');
    }

    // Call your backend API to process refund
    const response = await fetch('/api/razorpay/refund', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payment_id: payment.razorpay_payment_id,
        amount,
        reason,
      }),
    });

    if (!response.ok) {
      throw new Error('Refund failed');
    }

    // Update payment status
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        status: 'refunded',
        updated_at: new Date().toISOString(),
      })
      .eq('id', paymentId);

    if (updateError) throw updateError;

    return await response.json();
  } catch (error) {
    console.error('Error initiating refund:', error);
    return null;
  }
};

/**
 * Get payment statistics for admin
 * @param {Object} filters
 * @param {string} filters.startDate
 * @param {string} filters.endDate
 * @param {string} filters.status
 * @returns {Promise<Object>}
 */
export const getPaymentStats = async (filters = {}) => {
  try {
    let query = supabase
      .from('payments')
      .select('*');

    if (filters.startDate) {
      query = query.gte('created_at', filters.startDate);
    }

    if (filters.endDate) {
      query = query.lte('created_at', filters.endDate);
    }

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;

    if (error) throw error;

    const stats = {
      total: data?.length || 0,
      total_amount: data?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0,
      by_status: {},
    };

    data?.forEach(payment => {
      const status = payment.status || 'unknown';
      stats.by_status[status] = (stats.by_status[status] || 0) + 1;
    });

    return stats;
  } catch (error) {
    console.error('Error fetching payment stats:', error);
    return { total: 0, total_amount: 0, by_status: {} };
  }
};
