'use strict';

const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const { sendSuccess, sendError } = require('../utils/responses');

const getWishlist = async (req, res, next) => {
  try {
    const items = await Wishlist.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'price', 'image', 'slug'] }]
    });
    return sendSuccess(res, 200, items, 'Wishlist retrieved');
  } catch (err) {
    next(err);
  }
};

const addToWishlist = async (req, res, next) => {
  try {
    const { product_id } = req.body;

    const product = await Product.findByPk(product_id);
    if (!product) return sendError(res, 404, 'NOT_FOUND', 'Product not found');

    const existing = await Wishlist.findOne({ where: { user_id: req.user.id, product_id } });
    if (existing) return sendError(res, 409, 'CONFLICT', 'Product already in wishlist');

    const item = await Wishlist.create({ user_id: req.user.id, product_id });
    return sendSuccess(res, 201, item, 'Added to wishlist');
  } catch (err) {
    next(err);
  }
};

const removeFromWishlist = async (req, res, next) => {
  try {
    const item = await Wishlist.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!item) return sendError(res, 404, 'NOT_FOUND', 'Wishlist item not found');
    await item.destroy();
    return sendSuccess(res, 200, null, 'Removed from wishlist');
  } catch (err) {
    next(err);
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
