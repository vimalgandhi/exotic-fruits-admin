'use strict';

const { AppError } = require('../utils/errors');

const notFound = (req, res, next) => {
  next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404, 'NOT_FOUND'));
};

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let code = err.code || 'INTERNAL_ERROR';
  let message = err.message || 'Internal server error';
  let details = err.details || [];

  if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = 'Validation failed';
    details = err.errors.map((e) => ({ field: e.path, message: e.message }));
  } else if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    code = 'DUPLICATE_ENTRY';
    message = 'A record with that value already exists';
    details = err.errors.map((e) => ({ field: e.path, message: e.message }));
  } else if (err.name === 'SequelizeForeignKeyConstraintError') {
    statusCode = 400;
    code = 'FOREIGN_KEY_CONSTRAINT';
    message = 'Referenced record does not exist';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    code = 'INVALID_TOKEN';
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    code = 'TOKEN_EXPIRED';
    message = 'Token has expired';
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error('Error:', err);
  }

  res.status(statusCode).json({
    success: false,
    error: { code, message, details }
  });
};

module.exports = { notFound, errorHandler };
