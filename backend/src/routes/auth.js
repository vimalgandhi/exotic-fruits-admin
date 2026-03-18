'use strict';

const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, refreshToken } = require('../controllers/authController');
const { registerValidators, loginValidators } = require('../utils/validators');
const { validate } = require('../middleware/validation');

router.post('/register', registerValidators, validate, registerUser);
router.post('/login', loginValidators, validate, loginUser);
router.post('/logout', logoutUser);
router.post('/refresh-token', refreshToken);

module.exports = router;
