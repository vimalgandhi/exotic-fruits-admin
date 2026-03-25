'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Make user_id nullable in payments table
      await queryInterface.sequelize.query(
        'ALTER TABLE `payments` MODIFY `user_id` INT NULL'
      ).catch(err => {
        // Column might already be nullable, continue
      });
    } catch (error) {
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Revert user_id to not nullable
      await queryInterface.sequelize.query(
        'ALTER TABLE `payments` MODIFY `user_id` INT NOT NULL'
      ).catch(err => {
        // Column might already be not nullable, continue
      });
    } catch (error) {
      throw error;
    }
  }
};
