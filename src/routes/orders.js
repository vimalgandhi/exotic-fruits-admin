'use strict';

const express = require('express');
const router = express.Router();
const { getUserOrders, getOrder, createOrder, createPaymentOrder, updateOrderStatus, getAllOrders } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');
const { orderValidators } = require('../utils/validators');
const { validate } = require('../middleware/validation');

router.get('/', protect, getUserOrders);
router.get('/admin/all', protect, adminOnly, getAllOrders);
router.post('/', protect, orderValidators, validate, createOrder);
// New endpoint for post-payment order creation (no auth required)
router.post('/payment/create', createPaymentOrder);
router.get('/:id', protect, getOrder);
router.put('/:id', protect, adminOnly, updateOrderStatus);

module.exports = router;
