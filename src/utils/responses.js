'use strict';

const sendSuccess = (res, statusCode = 200, data = null, message = 'Success') => {
  const response = { success: true, message };
  if (data !== null) response.data = data;
  return res.status(statusCode).json(response);
};

const sendError = (res, statusCode = 500, code = 'INTERNAL_ERROR', message = 'An error occurred', details = []) => {
  return res.status(statusCode).json({
    success: false,
    error: { code, message, details }
  });
};

const sendPaginated = (res, data, total, page, limit, message = 'Success') => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      pages: Math.ceil(total / limit)
    }
  });
};

module.exports = { sendSuccess, sendError, sendPaginated };
