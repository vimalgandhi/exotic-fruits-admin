'use strict';

const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { sendSuccess, sendError } = require('../utils/responses');

const getCart = async (req, res, next) => {
  try {
    const items = await Cart.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'price', 'image', 'stock'] }]
    });
    return sendSuccess(res, 200, items, 'Cart retrieved');
  } catch (err) {
    next(err);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const { product_id, quantity } = req.body;

    const product = await Product.findByPk(product_id);
    if (!product) return sendError(res, 404, 'NOT_FOUND', 'Product not found');

    const existing = await Cart.findOne({ where: { user_id: req.user.id, product_id } });
    if (existing) {
      await existing.update({ quantity: existing.quantity + (quantity || 1) });
      return sendSuccess(res, 200, existing, 'Cart updated');
    }

    const item = await Cart.create({
      user_id: req.user.id,
      product_id,
      quantity: quantity || 1,
      unit_price: product.price
    });
    return sendSuccess(res, 201, item, 'Item added to cart');
  } catch (err) {
    next(err);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const item = await Cart.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!item) return sendError(res, 404, 'NOT_FOUND', 'Cart item not found');

    const { quantity } = req.body;
    if (!quantity || quantity < 1) return sendError(res, 400, 'INVALID_INPUT', 'Quantity must be at least 1');

    await item.update({ quantity });
    return sendSuccess(res, 200, item, 'Cart item updated');
  } catch (err) {
    next(err);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    const item = await Cart.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!item) return sendError(res, 404, 'NOT_FOUND', 'Cart item not found');
    await item.destroy();
    return sendSuccess(res, 200, null, 'Item removed from cart');
  } catch (err) {
    next(err);
  }
};

const clearCart = async (req, res, next) => {
  try {
    await Cart.destroy({ where: { user_id: req.user.id } });
    return sendSuccess(res, 200, null, 'Cart cleared');
  } catch (err) {
    next(err);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
