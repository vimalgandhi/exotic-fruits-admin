// Migration: Add new fields to products table

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const table = await queryInterface.describeTable('products', { transaction });
      const columnsToAdd = [
        { name: 'originCountry', def: { type: Sequelize.STRING(100), allowNull: true } },
        { name: 'foodType', def: { type: Sequelize.STRING(50), allowNull: true } },
        { name: 'stockStatus', def: { type: Sequelize.STRING(50), allowNull: true } },
        { name: 'status', def: { type: Sequelize.ENUM('Active', 'Inactive'), allowNull: false, defaultValue: 'Active' } },
        { name: 'featured', def: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false } },
        { name: 'pricelist', def: { type: Sequelize.TEXT, allowNull: true } },
        { name: 'seoMetaTitle', def: { type: Sequelize.STRING(255), allowNull: true } },
        { name: 'seoMetaDescription', def: { type: Sequelize.STRING(255), allowNull: true } },
        { name: 'seoAlt', def: { type: Sequelize.STRING(255), allowNull: true } },
        { name: 'seoIndex', def: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true } },
        { name: 'seoFollow', def: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true } },
        { name: 'seoCanonical', def: { type: Sequelize.STRING(255), allowNull: true } },
        { name: 'seoSchemaJson', def: { type: Sequelize.TEXT, allowNull: true } }
      ];

      for (const col of columnsToAdd) {
        if (!table[col.name]) {
          await queryInterface.addColumn('products', col.name, col.def, { transaction });
        }
      }
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const table = await queryInterface.describeTable('products', { transaction });
      const columnsToRemove = ['originCountry', 'foodType', 'stockStatus', 'status', 'featured', 'pricelist', 'seoMetaTitle', 'seoMetaDescription', 'seoAlt', 'seoIndex', 'seoFollow', 'seoCanonical', 'seoSchemaJson'];
      
      for (const col of columnsToRemove) {
        if (table[col]) {
          await queryInterface.removeColumn('products', col, { transaction });
        }
      }
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
