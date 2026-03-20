'use strict';

const { body, param, query } = require('express-validator');

const emailValidator = body('email')
  .isEmail()
  .withMessage('Please provide a valid email address')
  .normalizeEmail();

const passwordValidator = body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters long')
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number');

const registerValidators = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }).withMessage('Name must be at most 100 characters'),
  emailValidator,
  passwordValidator
];

const loginValidators = [
  body('email').isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
];

const productValidators = [
  body('name').trim().notEmpty().withMessage('Product name is required').isLength({ max: 200 }).withMessage('Name too long'),
];

const categoryValidators = [
  body('name').trim().notEmpty().withMessage('Category name is required').isLength({ max: 100 }).withMessage('Name too long')
];

const orderValidators = [
  body('delivery_address').trim().notEmpty().withMessage('Delivery address is required')
];

const idParamValidator = [
  param('id').isInt({ min: 1 }).withMessage('Invalid ID parameter')
];

module.exports = {
  registerValidators,
  loginValidators,
  productValidators,
  categoryValidators,
  orderValidators,
  idParamValidator
};
