import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

const OrderDetail = sequelize.define('OrderDetail', {
  order_detail_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  sale_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  book_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'OrderDetail',
  timestamps: false
});

export default OrderDetail;
