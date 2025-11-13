'use strict';

module.exports = {
  async up(qi, Sequelize) {
    await qi.sequelize.transaction(async (t) => {
      await qi.createTable('Cart', {
        cart_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        total: { type: Sequelize.DECIMAL(10,2), allowNull: false },
        user_id: { type: Sequelize.INTEGER, allowNull: true },
        created_date: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
        updated_date: { type: Sequelize.DATE, allowNull: true },
        deleted_date: { type: Sequelize.DATE, allowNull: true },
        created_by: { type: Sequelize.INTEGER, allowNull: true }
      }, { transaction: t, charset: 'utf8mb4', collate: 'utf8mb4_0900_ai_ci' });

      await qi.addConstraint('Cart', {
        fields: ['user_id'],
        type: 'foreign key',
        name: 'fk_cart_user',
        references: { table: 'User', field: 'user_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        transaction: t
      });
      await qi.addConstraint('Cart', {
        fields: ['created_by'],
        type: 'foreign key',
        name: 'fk_cart_created_by',
        references: { table: 'User', field: 'user_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        transaction: t
      });
    });
  },

  async down(qi) {
    await qi.sequelize.transaction(async (t) => {
      await qi.removeConstraint('Cart', 'fk_cart_created_by', { transaction: t }).catch(() => {});
      await qi.removeConstraint('Cart', 'fk_cart_user', { transaction: t }).catch(() => {});
      await qi.dropTable('Cart', { transaction: t });
    });
  }
};
