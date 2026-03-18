'use strict';

const Cart = require('../models/Cart');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const { sendSuccess, sendError, sendPaginated } = require('../utils/responses');
const { generateOrderNumber, getPaginationParams } = require('../utils/helpers');
const { sequelize } = require('../config/database');

const getUserOrders = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const { count, rows } = await Order.findAndCountAll({
      where: { user_id: req.user.id },
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
    return sendPaginated(res, rows, count, page, limit, 'Orders retrieved');
  } catch (err) {
    next(err);
  }
};

const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, user_id: req.user.id },
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'image'] }]
      }]
    });
    if (!order) return sendError(res, 404, 'NOT_FOUND', 'Order not found');
    return sendSuccess(res, 200, order, 'Order retrieved');
  } catch (err) {
    next(err);
  }
};

const createOrder = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { delivery_address } = req.body;

    const cartItems = await Cart.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Product, as: 'product' }]
    });

    if (cartItems.length === 0) {
      await t.rollback();
      return sendError(res, 400, 'EMPTY_CART', 'Your cart is empty');
    }

    const totalAmount = cartItems.reduce((sum, item) => sum + parseFloat(item.unit_price) * item.quantity, 0);
    const orderNumber = generateOrderNumber();

    const order = await Order.create({
      user_id: req.user.id,
      order_number: orderNumber,
      total_amount: totalAmount,
      delivery_address,
      status: 'pending'
    }, { transaction: t });

    const orderItems = cartItems.map((ci) => ({
      order_id: order.id,
      product_id: ci.product_id,
      quantity: ci.quantity,
      unit_price: ci.unit_price,
      subtotal: parseFloat(ci.unit_price) * ci.quantity
    }));
    await OrderItem.bulkCreate(orderItems, { transaction: t });

    await Cart.destroy({ where: { user_id: req.user.id }, transaction: t });

    await t.commit();
    return sendSuccess(res, 201, order, 'Order created successfully');
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return sendError(res, 404, 'NOT_FOUND', 'Order not found');
    const { status } = req.body;
    await order.update({ status });
    return sendSuccess(res, 200, order, 'Order status updated');
  } catch (err) {
    next(err);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const { count, rows } = await Order.findAndCountAll({
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
    return sendPaginated(res, rows, count, page, limit, 'All orders retrieved');
  } catch (err) {
    next(err);
  }
};

module.exports = { getUserOrders, getOrder, createOrder, updateOrderStatus, getAllOrders };
