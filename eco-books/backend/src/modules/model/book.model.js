import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';
import Author from './author.model.js';
import Category from './category.model.js';

const Book = sequelize.define('Book', {
  book_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  cover:{
    type: DataTypes.STRING(500),
    allowNull: true
  },
  description: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  publication_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  purchase_price: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  author_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  publisher_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'Book',
  timestamps: false
});

// Relation: A book belongs to an author
Book.belongsTo(Author, { foreignKey: 'author_id', as: 'author' });
Book.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

export default Book;