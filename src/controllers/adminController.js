'use strict';

const { sequelize } = require('../config/database');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { sendSuccess, sendPaginated } = require('../utils/responses');
const { getPaginationParams } = require('../utils/helpers');

const getDashboard = async (req, res, next) => {
  try {
    const [totalOrders, totalUsers, totalProducts, revenueResult] = await Promise.all([
      Order.count(),
      User.count({ where: { role: 'customer' } }),
      Product.count(),
      Order.sum('total_amount', { where: { status: ['confirmed', 'processing', 'shipped', 'delivered'] } })
    ]);

    const recentOrders = await Order.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    return sendSuccess(res, 200, {
      stats: {
        totalOrders,
        totalUsers,
        totalProducts,
        totalRevenue: revenueResult || 0
      },
      recentOrders
    }, 'Dashboard data retrieved');
  } catch (err) {
    next(err);
  }
};

const getAdminProducts = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const { count, rows } = await Product.findAndCountAll({
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      include: [{ model: require('../models/Category'), as: 'category', attributes: ['id', 'name'] }]
    });
    // Flatten category_name in each product
    const products = rows.map(product => {
      const p = product.toJSON();
      p.category_name = p.category ? p.category.name : null;
      return p;
    });
    return sendPaginated(res, products, count, page, limit, 'Products retrieved');
  } catch (err) {
    next(err);
  }
};

const getAdminOrders = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const { count, rows } = await Order.findAndCountAll({
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
    return sendPaginated(res, rows, count, page, limit, 'Orders retrieved');
  } catch (err) {
    next(err);
  }
};

const getAdminUsers = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const { count, rows } = await User.findAndCountAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
    return sendPaginated(res, rows, count, page, limit, 'Users retrieved');
  } catch (err) {
    next(err);
  }
};

const getAnalytics = async (req, res, next) => {
  try {
    const [ordersByStatus, revenueByMonth] = await Promise.all([
      Order.findAll({
        attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        group: ['status'],
        raw: true
      }),
      Order.findAll({
        attributes: [
          [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'month'],
          [sequelize.fn('SUM', sequelize.col('total_amount')), 'revenue'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'orders']
        ],
        where: { status: ['confirmed', 'processing', 'shipped', 'delivered'] },
        group: [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m')],
        order: [[sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'DESC']],
        limit: 12,
        raw: true
      })
    ]);

    return sendSuccess(res, 200, { ordersByStatus, revenueByMonth }, 'Analytics retrieved');
  } catch (err) {
    next(err);
  }
};

module.exports = { getDashboard, getAdminProducts, getAdminOrders, getAdminUsers, getAnalytics };
