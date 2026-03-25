'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const table = await queryInterface.describeTable('orders', { transaction });
      // Make user_id nullable - SQL approach
      try {
        await queryInterface.sequelize.query(
          'ALTER TABLE `orders` MODIFY `user_id` INT NULL',
          { transaction }
        );
      } catch (err) {
        // Column might already be nullable, continue
      }

      // Add columns for guest checkout and payment methods
      if (!table.payment_method) {
        await queryInterface.addColumn('orders', 'payment_method', {
          type: Sequelize.ENUM('cod', 'upi', 'card'),
          allowNull: true,
          comment: 'COD, UPI, or Card payment method'
        }, { transaction });
      }

      if (!table.customer_name) {
        await queryInterface.addColumn('orders', 'customer_name', {
          type: Sequelize.STRING(255),
          allowNull: true,
          comment: 'Customer name for guest orders'
        }, { transaction });
      }

      if (!table.customer_email) {
        await queryInterface.addColumn('orders', 'customer_email', {
          type: Sequelize.STRING(255),
          allowNull: true,
          comment: 'Customer email for guest orders and notifications'
        }, { transaction });
      }

      if (!table.customer_phone) {
        await queryInterface.addColumn('orders', 'customer_phone', {
          type: Sequelize.STRING(20),
          allowNull: true,
          comment: 'Customer phone for guest orders'
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
      
      if (table.customer_phone) {
        await queryInterface.removeColumn('orders', 'customer_phone', { transaction });
      }
      if (table.customer_email) {
        await queryInterface.removeColumn('orders', 'customer_email', { transaction });
      }
      if (table.customer_name) {
        await queryInterface.removeColumn('orders', 'customer_name', { transaction });
      }
      if (table.payment_method) {
        await queryInterface.removeColumn('orders', 'payment_method', { transaction });
      }

      // Revert user_id to not nullable
      try {
        await queryInterface.sequelize.query(
          'ALTER TABLE `orders` MODIFY `user_id` INT NOT NULL',
          { transaction }
        );
      } catch (err) {
        // Column might already be not nullable, continue
      }
      
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
