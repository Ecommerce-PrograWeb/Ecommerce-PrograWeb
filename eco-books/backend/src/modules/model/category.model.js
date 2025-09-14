import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

const Category = sequelize.define('Category', {
  category_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'Category',
  timestamps: false
});

export default Category;