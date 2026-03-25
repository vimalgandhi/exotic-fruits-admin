'use strict';

const { v4: uuidv4 } = require('uuid');

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s+]/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = uuidv4().split('-')[0].toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

const getPaginationParams = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 10));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

module.exports = { slugify, generateOrderNumber, getPaginationParams };
