'use strict';

const sendSuccess = (res, statusCode = 200, data = null, message = 'Success') => {
  const response = { success: true, message };
  if (data !== null) response.data = data;
  return res.status(statusCode).json(response);
};

const sendError = (res, statusCode = 500, code = 'INTERNAL_ERROR', message = 'An error occurred', details = []) => {
  // Extract first field message from details if available
  const fieldMessage = details.length > 0 && details[0].message ? details[0].message : message;
  
  return res.status(statusCode).json({
    success: false,
    message: fieldMessage,
    code,
    details
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
