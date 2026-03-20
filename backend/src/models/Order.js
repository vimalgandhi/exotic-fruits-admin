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
    allowNull: false,
    references: { model: 'users', key: 'id' }
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
