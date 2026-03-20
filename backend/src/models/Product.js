'use strict';

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING(220),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'categories', key: 'id' }
  },
  image: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  originCountry: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  foodType: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  stockStatus: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Active', 'Inactive'),
    allowNull: false,
    defaultValue: 'Active'
  },
  featured: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  pricelist: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  seoMetaTitle: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  seoMetaDescription: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  seoAlt: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  seoIndex: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  seoFollow: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  seoCanonical: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  seoSchemaJson: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'products',
  timestamps: true
});

module.exports = Product;
