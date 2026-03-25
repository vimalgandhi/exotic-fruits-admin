// Migration: Add new fields to products table

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('products', 'originCountry', {
      type: Sequelize.STRING(100),
      allowNull: true
    });
    await queryInterface.addColumn('products', 'foodType', {
      type: Sequelize.STRING(50),
      allowNull: true
    });
    await queryInterface.addColumn('products', 'stockStatus', {
      type: Sequelize.STRING(50),
      allowNull: true
    });
    await queryInterface.addColumn('products', 'status', {
      type: Sequelize.ENUM('Active', 'Inactive'),
      allowNull: false,
      defaultValue: 'Active'
    });
    await queryInterface.addColumn('products', 'featured', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
    await queryInterface.addColumn('products', 'pricelist', {
      type: Sequelize.TEXT,
      allowNull: true
    });
    await queryInterface.addColumn('products', 'seoMetaTitle', {
      type: Sequelize.STRING(255),
      allowNull: true
    });
    await queryInterface.addColumn('products', 'seoMetaDescription', {
      type: Sequelize.STRING(255),
      allowNull: true
    });
    await queryInterface.addColumn('products', 'seoAlt', {
      type: Sequelize.STRING(255),
      allowNull: true
    });
    await queryInterface.addColumn('products', 'seoIndex', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    });
    await queryInterface.addColumn('products', 'seoFollow', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    });
    await queryInterface.addColumn('products', 'seoCanonical', {
      type: Sequelize.STRING(255),
      allowNull: true
    });
    await queryInterface.addColumn('products', 'seoSchemaJson', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('products', 'originCountry');
    await queryInterface.removeColumn('products', 'foodType');
    await queryInterface.removeColumn('products', 'stockStatus');
    await queryInterface.removeColumn('products', 'status');
    await queryInterface.removeColumn('products', 'featured');
    await queryInterface.removeColumn('products', 'pricelist');
    await queryInterface.removeColumn('products', 'seoMetaTitle');
    await queryInterface.removeColumn('products', 'seoMetaDescription');
    await queryInterface.removeColumn('products', 'seoAlt');
    await queryInterface.removeColumn('products', 'seoIndex');
    await queryInterface.removeColumn('products', 'seoFollow');
    await queryInterface.removeColumn('products', 'seoCanonical');
    await queryInterface.removeColumn('products', 'seoSchemaJson');
  }
};
