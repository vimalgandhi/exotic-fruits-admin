'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const table = await queryInterface.describeTable('cart_items', { transaction });
      
      if (!table.selected_unit) {
        await queryInterface.addColumn('cart_items', 'selected_unit', {
          type: Sequelize.JSON,
          allowNull: true,
          comment: 'Stores selected price list unit information'
        }, { transaction });
      }

      if (!table.createdAt) {
        await queryInterface.addColumn('cart_items', 'createdAt', {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }, { transaction });
      }

      if (!table.updatedAt) {
        await queryInterface.addColumn('cart_items', 'updatedAt', {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
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
      const table = await queryInterface.describeTable('cart_items', { transaction });
      
      if (table.selected_unit) {
        await queryInterface.removeColumn('cart_items', 'selected_unit', { transaction });
      }
      if (table.createdAt) {
        await queryInterface.removeColumn('cart_items', 'createdAt', { transaction });
      }
      if (table.updatedAt) {
        await queryInterface.removeColumn('cart_items', 'updatedAt', { transaction });
      }
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
