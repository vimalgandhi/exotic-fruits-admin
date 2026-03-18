'use strict';

const express = require('express');
const router = express.Router();
const { getCategories, getCategory, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { protect, adminOnly } = require('../middleware/auth');
const { categoryValidators } = require('../utils/validators');
const { validate } = require('../middleware/validation');

router.get('/', getCategories);
router.get('/:id', getCategory);
router.post('/', protect, adminOnly, categoryValidators, validate, createCategory);
router.put('/:id', protect, adminOnly, updateCategory);
router.delete('/:id', protect, adminOnly, deleteCategory);

module.exports = router;
