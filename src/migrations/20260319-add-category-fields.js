// Migration: Add description, status, image columns to categories table

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const table = await queryInterface.describeTable('categories', { transaction });
      
      if (!table.description) {
        await queryInterface.addColumn('categories', 'description', {
          type: Sequelize.TEXT,
          allowNull: true
        }, { transaction });
      }
      
      if (!table.status) {
        await queryInterface.addColumn('categories', 'status', {
          type: Sequelize.ENUM('Active', 'Inactive'),
          allowNull: false,
          defaultValue: 'Active'
        }, { transaction });
      }
      
      if (!table.image) {
        await queryInterface.addColumn('categories', 'image', {
          type: Sequelize.STRING,
          allowNull: true
        }, { transaction });
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
      const table = await queryInterface.describeTable('categories', { transaction });
      
      if (table.description) {
        await queryInterface.removeColumn('categories', 'description', { transaction });
      }
      
      if (table.status) {
        await queryInterface.removeColumn('categories', 'status', { transaction });
      }
      
      if (table.image) {
        await queryInterface.removeColumn('categories', 'image', { transaction });
      }
      
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
