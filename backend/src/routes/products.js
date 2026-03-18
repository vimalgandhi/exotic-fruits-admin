'use strict';

const express = require('express');
const router = express.Router();
const {
  getProducts, getProduct, searchProducts, getProductsByCategory,
  createProduct, updateProduct, deleteProduct
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { productValidators } = require('../utils/validators');
const { validate } = require('../middleware/validation');

router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/category/:categoryId', getProductsByCategory);
router.get('/:id', getProduct);
router.post('/', protect, adminOnly, upload.single('image'), productValidators, validate, createProduct);
router.put('/:id', protect, adminOnly, upload.single('image'), updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
