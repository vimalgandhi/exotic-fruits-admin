'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { jwtSecret, jwtExpire, jwtRefreshSecret, jwtRefreshExpire } = require('../config/jwt');
const { sendSuccess, sendError } = require('../utils/responses');
const { ConflictError, AppError } = require('../utils/errors');

const generateTokens = (user) => {
  const payload = { id: user.id, email: user.email, name: user.name, role: user.role };
  const accessToken = jwt.sign(payload, jwtSecret, { expiresIn: jwtExpire });
  const refreshToken = jwt.sign({ id: user.id }, jwtRefreshSecret, { expiresIn: jwtRefreshExpire });
  return { accessToken, refreshToken };
};

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return sendError(res, 409, 'CONFLICT', 'An account with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword, phone });

    const { accessToken, refreshToken } = generateTokens(user);

    return sendSuccess(res, 201, {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, phone: user.phone }
    }, 'Registration successful');
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return sendError(res, 401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendError(res, 401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }

    const { accessToken, refreshToken } = generateTokens(user);

    return sendSuccess(res, 200, {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, phone: user.phone }
    }, 'Login successful');
  } catch (err) {
    next(err);
  }
};

const logoutUser = (req, res) => {
  return sendSuccess(res, 200, null, 'Logout successful');
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;
    if (!token) {
      return sendError(res, 400, 'MISSING_TOKEN', 'Refresh token is required');
    }

    let decoded;
    try {
      decoded = jwt.verify(token, jwtRefreshSecret);
    } catch (err) {
      return sendError(res, 401, 'INVALID_TOKEN', 'Invalid or expired refresh token');
    }

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return sendError(res, 401, 'USER_NOT_FOUND', 'User not found');
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    return sendSuccess(res, 200, {
      accessToken,
      refreshToken: newRefreshToken,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    }, 'Token refreshed');
  } catch (err) {
    next(err);
  }
};

module.exports = { registerUser, loginUser, logoutUser, refreshToken };
