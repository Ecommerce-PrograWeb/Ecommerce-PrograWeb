'use strict';

module.exports = {
  async up(qi, Sequelize) {
    await qi.sequelize.transaction(async (t) => {
      await qi.createTable('User', {
        user_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: Sequelize.STRING(100), allowNull: false },
        email: { type: Sequelize.STRING(100), allowNull: false },
        password: { type: Sequelize.STRING(100), allowNull: false },
        role_id: { type: Sequelize.INTEGER, allowNull: true },
        created_date: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
        updated_date: { type: Sequelize.DATE, allowNull: true },
        deleted_date: { type: Sequelize.DATE, allowNull: true },
        created_by: { type: Sequelize.INTEGER, allowNull: true } 
      }, { transaction: t });

      await qi.addConstraint('User', {
        fields: ['role_id'],
        type: 'foreign key',
        name: 'fk_user_role',
        references: { table: 'Role', field: 'role_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        transaction: t
      });

      await qi.addConstraint('User', {
        fields: ['created_by'],
        type: 'foreign key',
        name: 'fk_user_created_by',
        references: { table: 'User', field: 'user_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        transaction: t
      });
    });
  },

  async down(qi) {
    await qi.sequelize.transaction(async (t) => {
      await qi.removeConstraint('User', 'fk_user_created_by', { transaction: t }).catch(() => {});
      await qi.removeConstraint('User', 'fk_user_role', { transaction: t }).catch(() => {});
      await qi.dropTable('User', { transaction: t });
    });
  }
};
