'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const table = await queryInterface.describeTable('order_items', { transaction });
      
      if (!table.selected_unit) {
        await queryInterface.addColumn('order_items', 'selected_unit', {
          type: Sequelize.JSON,
          allowNull: true,
          comment: 'Stores selected price list unit information'
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
      const table = await queryInterface.describeTable('order_items', { transaction });
      
      if (table.selected_unit) {
        await queryInterface.removeColumn('order_items', 'selected_unit', { transaction });
      }
      
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
