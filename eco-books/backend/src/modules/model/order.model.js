import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

const Order = sequelize.define('Order', {
  order_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  date: {
    type: DataTypes.DATEONLY,  
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Delivered'),
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  order_detail_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  address_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cart_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'Order',   
  timestamps: false
});

export default Order;
