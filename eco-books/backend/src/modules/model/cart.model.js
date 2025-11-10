import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

const Cart = sequelize.define('Cart', {
    cart_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'Cart',
    timestamps: true,
    paranoid: true,
    createdAt: false,
    updatedAt: false,
    deletedAt: 'deleted_at'
});

export default Cart;
