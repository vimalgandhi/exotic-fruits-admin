// Migration: Add description, status, image columns to categories table

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('categories', 'description', {
      type: Sequelize.TEXT,
      allowNull: true
    });
    await queryInterface.addColumn('categories', 'status', {
      type: Sequelize.ENUM('Active', 'Inactive'),
      allowNull: false,
      defaultValue: 'Active'
    });
    await queryInterface.addColumn('categories', 'image', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('categories', 'description');
    await queryInterface.removeColumn('categories', 'status');
    await queryInterface.removeColumn('categories', 'image');
  }
};
