'use strict';

module.exports = {
  async up(qi, Sequelize) {
    await qi.sequelize.transaction(async (t) => {
      await qi.createTable('OrderDetail', {
        order_detail_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        sale_price: { type: Sequelize.DECIMAL(10,2), allowNull: false },
        book_id: { type: Sequelize.INTEGER, allowNull: true },
        created_date: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
        updated_date: { type: Sequelize.DATE, allowNull: true },
        deleted_date: { type: Sequelize.DATE, allowNull: true },
        created_by: { type: Sequelize.INTEGER, allowNull: true }
      }, { transaction: t, charset: 'utf8mb4', collate: 'utf8mb4_0900_ai_ci' });

      await qi.addConstraint('OrderDetail', {
        fields: ['book_id'],
        type: 'foreign key',
        name: 'fk_orderdetail_book',
        references: { table: 'Book', field: 'book_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        transaction: t
      });
      await qi.addConstraint('OrderDetail', {
        fields: ['created_by'],
        type: 'foreign key',
        name: 'fk_orderdetail_created_by',
        references: { table: 'User', field: 'user_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        transaction: t
      });
    });
  },

  async down(qi) {
    await qi.sequelize.transaction(async (t) => {
      await qi.removeConstraint('OrderDetail', 'fk_orderdetail_created_by', { transaction: t }).catch(() => {});
      await qi.removeConstraint('OrderDetail', 'fk_orderdetail_book', { transaction: t }).catch(() => {});
      await qi.dropTable('OrderDetail', { transaction: t });
    });
  }
};
