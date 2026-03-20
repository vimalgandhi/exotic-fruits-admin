'use strict';

const express = require('express');
const router = express.Router();
const {
  getProducts, getProduct, searchProducts, getProductsByCategory,
  createProduct, updateProduct, deleteProduct
} = require('../controllers/productController');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { productValidators } = require('../utils/validators');
const { validate } = require('../middleware/validation');

// PUBLIC routes (no auth needed, but optional auth for wishlist check)
router.get('/', optionalAuth, getProducts);
router.get('/search', optionalAuth, searchProducts);
router.get('/category/:categoryId', optionalAuth, getProductsByCategory);
router.get('/slug/:slug', optionalAuth, getProduct);
router.get('/:id', optionalAuth, getProduct);
// ADMIN routes (require auth + admin role)
router.post('/', protect, adminOnly, upload.single('image'), productValidators, validate, createProduct);
router.put('/:id', protect, adminOnly, upload.single('image'), updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
