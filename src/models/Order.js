'use strict';

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // Allow null for guest checkout
    references: { model: 'users', key: 'id' },
    onDelete: 'SET NULL'
  },
  order_number: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending'
  },
  delivery_address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  payment_method: {
    type: DataTypes.ENUM('cod', 'upi', 'card'),
    allowNull: true,
    comment: 'COD, UPI, or Card payment method'
  },
  customer_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Customer name for guest orders'
  },
  customer_email: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Customer email for guest orders and notifications'
  },
  customer_phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Customer phone for guest orders'
  },
  tamper_detected: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Flag to indicate potential price tampering attempt'
  }
}, {
  tableName: 'orders',
  timestamps: true
});

module.exports = Order;
