'use strict';

const express = require('express');
const router = express.Router();
const { getUserOrders, getOrder, createOrder, updateOrderStatus, getAllOrders } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');
const { orderValidators } = require('../utils/validators');
const { validate } = require('../middleware/validation');

router.get('/', protect, getUserOrders);
router.get('/admin/all', protect, adminOnly, getAllOrders);
router.get('/:id', protect, getOrder);
router.post('/', protect, orderValidators, validate, createOrder);
router.put('/:id', protect, adminOnly, updateOrderStatus);

module.exports = router;
