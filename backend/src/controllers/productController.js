'use strict';

const { Op } = require('sequelize');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { sendSuccess, sendError, sendPaginated } = require('../utils/responses');
const { slugify, getPaginationParams } = require('../utils/helpers');
const { uploadToCloudinary } = require('../utils/cloudinaryUpload');

const getProducts = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const { category, minPrice, maxPrice, sort } = req.query;

    const where = {};
    if (category) where.category_id = category;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    const order = [];
    if (sort === 'price_asc') order.push(['price', 'ASC']);
    else if (sort === 'price_desc') order.push(['price', 'DESC']);
    else if (sort === 'newest') order.push(['createdAt', 'DESC']);
    else order.push(['createdAt', 'DESC']);

    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }],
      order,
      limit,
      offset
    });

    return sendPaginated(res, rows, count, page, limit, 'Products retrieved');
  } catch (err) {
    next(err);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }]
    });
    if (!product) return sendError(res, 404, 'NOT_FOUND', 'Product not found');
    return sendSuccess(res, 200, product, 'Product retrieved');
  } catch (err) {
    next(err);
  }
};

const searchProducts = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return sendError(res, 400, 'MISSING_QUERY', 'Search query is required');

    const { page, limit, offset } = getPaginationParams(req.query);
    const { count, rows } = await Product.findAndCountAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${q}%` } },
          { description: { [Op.like]: `%${q}%` } }
        ]
      },
      include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }],
      limit,
      offset
    });

    return sendPaginated(res, rows, count, page, limit, 'Search results');
  } catch (err) {
    next(err);
  }
};

const getProductsByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { page, limit, offset } = getPaginationParams(req.query);

    const { count, rows } = await Product.findAndCountAll({
      where: { category_id: categoryId },
      include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }],
      limit,
      offset
    });

    return sendPaginated(res, rows, count, page, limit, 'Products by category');
  } catch (err) {
    next(err);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category_id, stock } = req.body;
    const slug = slugify(name);

    let imageUrl = null;
    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file.buffer, 'exotic-fruits/products');
      imageUrl = uploaded.url;
    }

    const product = await Product.create({ name, slug, description, price, category_id, stock, image: imageUrl });
    return sendSuccess(res, 201, product, 'Product created');
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return sendError(res, 404, 'NOT_FOUND', 'Product not found');

    const { name, description, price, category_id, stock } = req.body;
    const updates = { description, price, category_id, stock };
    if (name) {
      updates.name = name;
      updates.slug = slugify(name);
    }

    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file.buffer, 'exotic-fruits/products');
      updates.image = uploaded.url;
    }

    await product.update(updates);
    return sendSuccess(res, 200, product, 'Product updated');
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return sendError(res, 404, 'NOT_FOUND', 'Product not found');
    await product.destroy();
    return sendSuccess(res, 200, null, 'Product deleted');
  } catch (err) {
    next(err);
  }
};

module.exports = { getProducts, getProduct, searchProducts, getProductsByCategory, createProduct, updateProduct, deleteProduct };
