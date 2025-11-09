import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

const Address = sequelize.define('Address', {
  address_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  zone: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'Address',
  timestamps: true,
  paranoid: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: 'deleted_at'
});

export default Address;
