'use strict';

const crypto = require('crypto');
const razorpay = require('../config/razorpay');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const { sendSuccess, sendError } = require('../utils/responses');

const createRazorpayOrder = async (req, res, next) => {
  try {
    const { order_id } = req.body;

    // Validate order_id
    if (!order_id) {
      return sendError(res, 400, 'MISSING_ORDER_ID', 'Order ID is required');
    }

    const order = await Order.findOne({ where: { id: order_id, user_id: req.user.id } });
    if (!order) return sendError(res, 404, 'NOT_FOUND', 'Order not found');

    // Validate order amount
    const amount = Math.round(parseFloat(order.total_amount) * 100); // paise
    if (!amount || amount <= 0) {
      return sendError(res, 400, 'INVALID_AMOUNT', 'Order amount must be greater than 0');
    }

    const options = {
      amount: amount,
      currency: 'INR',
      receipt: order.order_number.toString()
    };

    try {
      const razorpayOrder = await razorpay.orders.create(options);

      await Payment.create({
        order_id: order.id,
        user_id: req.user.id,
        razorpay_order_id: razorpayOrder.id,
        amount: order.total_amount,
        status: 'pending'
      });

      return sendSuccess(res, 201, {
        razorpay_order_id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key_id: process.env.RAZORPAY_KEY_ID
      }, 'Razorpay order created');
    } catch (razorpayError) {
      console.error('Razorpay API Error:', razorpayError.message);
      console.error('Razorpay Error Details:', razorpayError);
      return sendError(res, 400, 'RAZORPAY_ERROR', `Failed to create Razorpay order: ${razorpayError.message}`);
    }
  } catch (err) {
    next(err);
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return sendError(res, 400, 'INVALID_SIGNATURE', 'Payment verification failed');
    }

    const payment = await Payment.findOne({ where: { razorpay_order_id } });
    if (!payment) return sendError(res, 404, 'NOT_FOUND', 'Payment record not found');

    await payment.update({ razorpay_payment_id, status: 'completed' });
    await Order.update({ status: 'confirmed' }, { where: { id: payment.order_id } });

    return sendSuccess(res, 200, payment, 'Payment verified successfully');
  } catch (err) {
    next(err);
  }
};

const getPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!payment) return sendError(res, 404, 'NOT_FOUND', 'Payment not found');
    return sendSuccess(res, 200, payment, 'Payment retrieved');
  } catch (err) {
    next(err);
  }
};

module.exports = { createRazorpayOrder, verifyPayment, getPayment };
