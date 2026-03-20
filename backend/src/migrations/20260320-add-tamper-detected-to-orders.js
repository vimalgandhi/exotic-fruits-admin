'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('orders', 'tamper_detected', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      comment: 'Flag to indicate potential price tampering attempt'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('orders', 'tamper_detected');
  }
};
