'use strict';

const express = require('express');
const router = express.Router();
const { getCategories, getCategory, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { protect, adminOnly } = require('../middleware/auth');
const { categoryValidators } = require('../utils/validators');
const { validate } = require('../middleware/validation');

router.get('/', getCategories);
router.get('/:id', getCategory);
const upload = require('../middleware/upload');
router.post('/', protect, adminOnly, upload.single('image'), categoryValidators, validate, createCategory);
router.put('/:id', protect, adminOnly, upload.single('image'), updateCategory);
router.delete('/:id', protect, adminOnly, deleteCategory);

module.exports = router;
