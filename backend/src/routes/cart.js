'use strict';

const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getCart);
router.post('/add', protect, addToCart);
router.put('/:id', protect, updateCartItem);
router.delete('/clear', protect, clearCart);
router.delete('/:id', protect, removeFromCart);

module.exports = router;
