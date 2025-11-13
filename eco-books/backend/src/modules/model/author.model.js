import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

const Author = sequelize.define('Author', {
  author_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'Author',
  timestamps: true,
  paranoid: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: 'deleted_at'
});

export default Author;
