'use strict';

module.exports = {
  async up(qi, Sequelize) {
    await qi.sequelize.transaction(async (t) => {
      await qi.createTable('Address', {
        address_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        city: { type: Sequelize.STRING(100), allowNull: false },
        zone: { type: Sequelize.STRING(100), allowNull: false },
        name: { type: Sequelize.STRING(100), allowNull: true },
        created_date: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
        updated_date: { type: Sequelize.DATE, allowNull: true },
        deleted_date: { type: Sequelize.DATE, allowNull: true },
        created_by: { type: Sequelize.INTEGER, allowNull: true }
      }, { transaction: t, charset: 'utf8mb4', collate: 'utf8mb4_0900_ai_ci' });

      await qi.addConstraint('Address', {
        fields: ['created_by'],
        type: 'foreign key',
        name: 'fk_address_created_by',
        references: { table: 'User', field: 'user_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        transaction: t
      });
    });
  },

  async down(qi) {
    await qi.sequelize.transaction(async (t) => {
      await qi.removeConstraint('Address', 'fk_address_created_by', { transaction: t }).catch(() => {});
      await qi.dropTable('Address', { transaction: t });
    });
  }
};
