'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add deleted_at column to all tables that need soft delete
    const tables = [
      'User',
      'Book',
      'Cart',
      'Order',
      'OrderDetail',
      'Address',
      'Author',
      'Category'
    ];

    for (const table of tables) {
      await queryInterface.addColumn(table, 'deleted_at', {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tables = [
      'User',
      'Book',
      'Cart',
      'Order',
      'OrderDetail',
      'Address',
      'Author',
      'Category'
    ];

    for (const table of tables) {
      await queryInterface.removeColumn(table, 'deleted_at');
    }
  }
};