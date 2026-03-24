'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add selected_unit column for storing unit information
    await queryInterface.addColumn('cart_items', 'selected_unit', {
      type: Sequelize.JSON,
      allowNull: true,
      comment: 'Stores selected price list unit information'
    });

    // Add createdAt column
    await queryInterface.addColumn('cart_items', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });

    // Add updatedAt column
    await queryInterface.addColumn('cart_items', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('cart_items', 'selected_unit');
    await queryInterface.removeColumn('cart_items', 'createdAt');
    await queryInterface.removeColumn('cart_items', 'updatedAt');
  }
};
