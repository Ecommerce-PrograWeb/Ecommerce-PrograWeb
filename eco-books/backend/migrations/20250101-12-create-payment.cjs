'use strict';

module.exports = {
  async up(qi, Sequelize) {
    await qi.sequelize.transaction(async (t) => {
      await qi.createTable('Payment', {
        payment_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        order_id: { type: Sequelize.INTEGER, allowNull: true },
        payment_date: { type: Sequelize.DATEONLY, allowNull: false },
        amount: { type: Sequelize.DECIMAL(10,2), allowNull: false },
        payment_method: { type: Sequelize.ENUM('Cash', 'Card'), allowNull: false },
        created_date: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
        updated_date: { type: Sequelize.DATE, allowNull: true },
        deleted_date: { type: Sequelize.DATE, allowNull: true },
        created_by: { type: Sequelize.INTEGER, allowNull: true }
      }, { transaction: t, charset: 'utf8mb4', collate: 'utf8mb4_0900_ai_ci' });

      await qi.addConstraint('Payment', {
        fields: ['order_id'],
        type: 'foreign key',
        name: 'fk_payment_order',
        references: { table: 'Order', field: 'order_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        transaction: t
      });
      await qi.addConstraint('Payment', {
        fields: ['created_by'],
        type: 'foreign key',
        name: 'fk_payment_created_by',
        references: { table: 'User', field: 'user_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        transaction: t
      });
    });
  },

  async down(qi) {
    await qi.sequelize.transaction(async (t) => {
      await qi.removeConstraint('Payment', 'fk_payment_created_by', { transaction: t }).catch(() => {});
      await qi.removeConstraint('Payment', 'fk_payment_order', { transaction: t }).catch(() => {});
      await qi.dropTable('Payment', { transaction: t });
    });
  }
};
