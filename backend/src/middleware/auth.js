'use strict';

const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/jwt');
const { sendError } = require('../utils/responses');

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 401, 'UNAUTHORIZED', 'No token provided');
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return sendError(res, 401, 'TOKEN_EXPIRED', 'Access token has expired');
    }
    return sendError(res, 401, 'INVALID_TOKEN', 'Invalid access token');
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return sendError(res, 403, 'FORBIDDEN', 'Admin access required');
  }
  next();
};

module.exports = { protect, adminOnly };
