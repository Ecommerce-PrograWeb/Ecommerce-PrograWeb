import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

const Order = sequelize.define(
  "Order",
  {
    order_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_DATE"),
    },

    status: {
      type: DataTypes.ENUM("Pending", "Delivered"),
      allowNull: false,
      defaultValue: "Pending",
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "User", key: "user_id" },
    },

    order_detail_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "OrderDetail", key: "order_detail_id" },
    },

    address_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "Address", key: "address_id" },
    },

    cart_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "Cart", key: "cart_id" },
    },
  },
  {
    tableName: "Order",
    timestamps: false,
  }
);

export default Order;
