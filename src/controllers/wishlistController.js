'use strict';

const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const { sendSuccess, sendError } = require('../utils/responses');

const getWishlist = async (req, res, next) => {
  try {
    const items = await Wishlist.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'pricelist', 'image', 'slug'] }]
    });
    return sendSuccess(res, 200, items, 'Wishlist retrieved');
  } catch (err) {
    next(err);
  }
};

const toggleWishlist = async (req, res, next) => {
  try {
    const product_id = req.body.product_id || req.body.productId;
    const userId = req.user.id;
    
    if (!product_id) return sendError(res, 400, 'MISSING_FIELD', 'productId is required');
    if (!userId) return sendError(res, 401, 'UNAUTHORIZED', 'User not authenticated');

    const product = await Product.findByPk(product_id);
    if (!product) return sendError(res, 404, 'NOT_FOUND', 'Product not found');

    const existing = await Wishlist.findOne({ where: { user_id: userId, product_id } });
    
    if (existing) {
      // Remove from wishlist
      await existing.destroy();
      return sendSuccess(res, 200, { inWishlist: false, productId: product_id }, 'Removed from wishlist');
    } else {
      // Add to wishlist
      const item = await Wishlist.create({ user_id: userId, product_id });
      return sendSuccess(res, 201, { inWishlist: true, productId: product_id, id: item.id }, 'Added to wishlist');
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { getWishlist, toggleWishlist };
