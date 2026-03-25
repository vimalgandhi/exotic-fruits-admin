'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const table = await queryInterface.describeTable('orders', { transaction });
      if (!table.tamper_detected) {
        await queryInterface.addColumn('orders', 'tamper_detected', {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          comment: 'Flag to indicate potential price tampering attempt'
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
      const table = await queryInterface.describeTable('orders', { transaction });
      if (table.tamper_detected) {
        await queryInterface.removeColumn('orders', 'tamper_detected', { transaction });
      }
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
