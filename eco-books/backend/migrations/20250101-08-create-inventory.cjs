'use strict';

module.exports = {
  async up(qi, Sequelize) {
    await qi.sequelize.transaction(async (t) => {
      await qi.createTable('Inventory', {
        inventory_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        quantity: { type: Sequelize.INTEGER, allowNull: false },
        location: { type: Sequelize.STRING(100), allowNull: false },
        book_id: { type: Sequelize.INTEGER, allowNull: true },
        created_date: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
        updated_date: { type: Sequelize.DATE, allowNull: true },
        deleted_date: { type: Sequelize.DATE, allowNull: true },
        created_by: { type: Sequelize.INTEGER, allowNull: true }
      }, { transaction: t, charset: 'utf8mb4', collate: 'utf8mb4_0900_ai_ci' });

      await qi.addConstraint('Inventory', {
        fields: ['book_id'],
        type: 'foreign key',
        name: 'fk_inventory_book',
        references: { table: 'Book', field: 'book_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        transaction: t
      });
      await qi.addConstraint('Inventory', {
        fields: ['created_by'],
        type: 'foreign key',
        name: 'fk_inventory_created_by',
        references: { table: 'User', field: 'user_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        transaction: t
      });
    });
  },

  async down(qi) {
    await qi.sequelize.transaction(async (t) => {
      await qi.removeConstraint('Inventory', 'fk_inventory_created_by', { transaction: t }).catch(() => {});
      await qi.removeConstraint('Inventory', 'fk_inventory_book', { transaction: t }).catch(() => {});
      await qi.dropTable('Inventory', { transaction: t });
    });
  }
};
