'use strict';

module.exports = {
  async up(qi, Sequelize) {
    await qi.sequelize.transaction(async (t) => {
      await qi.createTable('Order', {
        order_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        date: { type: Sequelize.DATEONLY, allowNull: false },
        status: { type: Sequelize.ENUM('Pending', 'Delivered'), allowNull: false },
        user_id: { type: Sequelize.INTEGER, allowNull: true },
        order_detail_id: { type: Sequelize.INTEGER, allowNull: true },
        address_id: { type: Sequelize.INTEGER, allowNull: true },
        cart_id: { type: Sequelize.INTEGER, allowNull: true },
        created_date: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
        updated_date: { type: Sequelize.DATE, allowNull: true },
        deleted_date: { type: Sequelize.DATE, allowNull: true },
        created_by: { type: Sequelize.INTEGER, allowNull: true }
      }, { transaction: t, charset: 'utf8mb4', collate: 'utf8mb4_0900_ai_ci' });

      await qi.addConstraint('Order', {
        fields: ['user_id'],
        type: 'foreign key',
        name: 'fk_order_user',
        references: { table: 'User', field: 'user_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        transaction: t
      });
      await qi.addConstraint('Order', {
        fields: ['order_detail_id'],
        type: 'foreign key',
        name: 'fk_order_order_detail',
        references: { table: 'OrderDetail', field: 'order_detail_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        transaction: t
      });
      await qi.addConstraint('Order', {
        fields: ['address_id'],
        type: 'foreign key',
        name: 'fk_order_address',
        references: { table: 'Address', field: 'address_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        transaction: t
      });
      await qi.addConstraint('Order', {
        fields: ['cart_id'],
        type: 'foreign key',
        name: 'fk_order_cart',
        references: { table: 'Cart', field: 'cart_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        transaction: t
      });
      await qi.addConstraint('Order', {
        fields: ['created_by'],
        type: 'foreign key',
        name: 'fk_order_created_by',
        references: { table: 'User', field: 'user_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        transaction: t
      });
    });
  },

  async down(qi) {
    await qi.sequelize.transaction(async (t) => {
      await qi.removeConstraint('Order', 'fk_order_created_by', { transaction: t }).catch(() => {});
      await qi.removeConstraint('Order', 'fk_order_cart', { transaction: t }).catch(() => {});
      await qi.removeConstraint('Order', 'fk_order_address', { transaction: t }).catch(() => {});
      await qi.removeConstraint('Order', 'fk_order_order_detail', { transaction: t }).catch(() => {});
      await qi.removeConstraint('Order', 'fk_order_user', { transaction: t }).catch(() => {});
      await qi.dropTable('Order', { transaction: t });
    });
  }
};
