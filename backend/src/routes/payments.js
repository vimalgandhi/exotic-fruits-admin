'use strict';

const express = require('express');
const router = express.Router();
const { createRazorpayOrder, verifyPayment, getPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/create-order', protect, createRazorpayOrder);
router.post('/verify-payment', protect, verifyPayment);
router.get('/:id', protect, getPayment);

module.exports = router;
