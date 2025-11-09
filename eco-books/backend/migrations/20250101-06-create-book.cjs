'use strict';

module.exports = {
  async up(qi, Sequelize) {
    await qi.sequelize.transaction(async (t) => {
      await qi.createTable('Book', {
        book_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: Sequelize.STRING(100), allowNull: false },
        cover: { type: Sequelize.STRING(500), allowNull: true },
        description: { type: Sequelize.STRING(500), allowNull: false },
        publication_date: { type: Sequelize.DATEONLY, allowNull: false },
        purchase_price: { type: Sequelize.DECIMAL(10,2), allowNull: false },
        author_id: { type: Sequelize.INTEGER, allowNull: true },
        publisher_id: { type: Sequelize.INTEGER, allowNull: true },
        category_id: { type: Sequelize.INTEGER, allowNull: true },
        created_date: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
        updated_date: { type: Sequelize.DATE, allowNull: true },
        deleted_date: { type: Sequelize.DATE, allowNull: true },
        created_by: { type: Sequelize.INTEGER, allowNull: true }
      }, { transaction: t, charset: 'utf8mb4', collate: 'utf8mb4_0900_ai_ci' });

      await qi.addConstraint('Book', {
        fields: ['author_id'],
        type: 'foreign key',
        name: 'fk_book_author',
        references: { table: 'Author', field: 'author_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        transaction: t
      });
      await qi.addConstraint('Book', {
        fields: ['publisher_id'],
        type: 'foreign key',
        name: 'fk_book_publisher',
        references: { table: 'Publisher', field: 'publisher_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        transaction: t
      });
      await qi.addConstraint('Book', {
        fields: ['category_id'],
        type: 'foreign key',
        name: 'fk_book_category',
        references: { table: 'Category', field: 'category_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        transaction: t
      });
      await qi.addConstraint('Book', {
        fields: ['created_by'],
        type: 'foreign key',
        name: 'fk_book_created_by',
        references: { table: 'User', field: 'user_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        transaction: t
      });
    });
  },

  async down(qi) {
    await qi.sequelize.transaction(async (t) => {
      await qi.removeConstraint('Book', 'fk_book_created_by', { transaction: t }).catch(() => {});
      await qi.removeConstraint('Book', 'fk_book_category', { transaction: t }).catch(() => {});
      await qi.removeConstraint('Book', 'fk_book_publisher', { transaction: t }).catch(() => {});
      await qi.removeConstraint('Book', 'fk_book_author', { transaction: t }).catch(() => {});
      await qi.dropTable('Book', { transaction: t });
    });
  }
};
