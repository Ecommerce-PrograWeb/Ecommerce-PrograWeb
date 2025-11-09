'use strict';

module.exports = {
  async up(qi, Sequelize) {
    await qi.sequelize.transaction(async (t) => {
      await qi.createTable('Role', {
        role_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        type: { 
          type: Sequelize.ENUM('Customer', 'Admin'), 
          allowNull: false 
        },
        created_date: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
        updated_date: { type: Sequelize.DATE, allowNull: true },
        deleted_date: { type: Sequelize.DATE, allowNull: true },
        created_by: { type: Sequelize.INTEGER, allowNull: true } 
      }, { transaction: t });
    });
  },

  async down(qi, Sequelize) {
    await qi.sequelize.transaction(async (t) => {
      await qi.dropTable('Role', { transaction: t });
      await qi.sequelize.query("DROP TYPE IF EXISTS `enum_Role_type`;", { transaction: t }).catch(() => {});
    });
  }
};
