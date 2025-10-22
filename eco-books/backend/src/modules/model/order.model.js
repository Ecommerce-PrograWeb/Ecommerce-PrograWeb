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

// Import related models for associations
import OrderDetail from './order-detail.model.js';
import Cart from './cart.model.js';
import Address from './address.model.js';
import User from './user.model.js';

// Define associations
Order.belongsTo(OrderDetail, { foreignKey: 'order_detail_id', as: 'orderDetail' });
Order.belongsTo(Cart, { foreignKey: 'cart_id', as: 'cart' });
Order.belongsTo(Address, { foreignKey: 'address_id', as: 'address' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

export default Order;
