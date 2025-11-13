'use strict';

module.exports = {
  async up(qi, Sequelize) {
    await qi.sequelize.transaction(async (t) => {
      await qi.createTable('Publisher', {
        publisher_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: Sequelize.STRING(100), allowNull: false },
        created_date: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
        updated_date: { type: Sequelize.DATE, allowNull: true },
        deleted_date: { type: Sequelize.DATE, allowNull: true },
        created_by: { type: Sequelize.INTEGER, allowNull: true }
      }, { transaction: t, charset: 'utf8mb4', collate: 'utf8mb4_0900_ai_ci' });

      await qi.addConstraint('Publisher', {
        fields: ['created_by'],
        type: 'foreign key',
        name: 'fk_publisher_created_by',
        references: { table: 'User', field: 'user_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        transaction: t
      });
    });
  },

  async down(qi) {
    await qi.sequelize.transaction(async (t) => {
      await qi.removeConstraint('Publisher', 'fk_publisher_created_by', { transaction: t }).catch(() => {});
      await qi.dropTable('Publisher', { transaction: t });
    });
  }
};
