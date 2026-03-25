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

const optionalAuth = (req, res, next) => {
  console.log('\n=== OPTIONAL AUTH MIDDLEWARE START ===');
  const authHeader = req.headers.authorization;
  console.log('Authorization header:', authHeader);
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No valid Bearer token found');
    console.log('=== OPTIONAL AUTH MIDDLEWARE END (NO TOKEN) ===\n');
    return next();
  }

  try {
    const token = authHeader.split(' ')[1];
    console.log('Token found, attempting decode...');
    const decoded = jwt.verify(token, jwtSecret);
    console.log('✅ Token decoded successfully!');
    console.log('Decoded user ID:', decoded.id);
    req.user = decoded;
    console.log('✅ req.user set:', req.user);
  } catch (err) {
    console.log('❌ Token error:', err.message);
  }
  
  console.log('=== OPTIONAL AUTH MIDDLEWARE END ===\n');
  next();
};

module.exports = { protect, adminOnly, optionalAuth };
