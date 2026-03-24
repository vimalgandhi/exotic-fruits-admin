'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Make user_id nullable - SQL approach
      await queryInterface.sequelize.query(
        'ALTER TABLE `orders` MODIFY `user_id` INT NULL'
      );

      // Add newcolumns for guest checkout and payment methods
      await queryInterface.addColumn('orders', 'payment_method', {
        type: Sequelize.ENUM('cod', 'upi', 'card'),
        allowNull: true,
        comment: 'COD, UPI, or Card payment method'
      });

      await queryInterface.addColumn('orders', 'customer_name', {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Customer name for guest orders'
      });

      await queryInterface.addColumn('orders', 'customer_email', {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Customer email for guest orders and notifications'
      });

      await queryInterface.addColumn('orders', 'customer_phone', {
        type: Sequelize.STRING(20),
        allowNull: true,
        comment: 'Customer phone for guest orders'
      });
    } catch (error) {
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn('orders', 'customer_phone');
      await queryInterface.removeColumn('orders', 'customer_email');
      await queryInterface.removeColumn('orders', 'customer_name');
      await queryInterface.removeColumn('orders', 'payment_method');

      // Revert user_id to not nullable
      await queryInterface.sequelize.query(
        'ALTER TABLE `orders` MODIFY `user_id` INT NOT NULL'
      );
    } catch (error) {
      throw error;
    }
  }
};
