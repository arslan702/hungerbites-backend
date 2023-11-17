/*
Order_Items:
•	id (Primary Key)
•	order_id (Foreign Key to Orders table)
•	product_id (Foreign Key to Products table)
•	quantity
*/

const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Order = require("./order.model");
const MenuItem = require("./menuItems.model");

class OrderItem extends Model {}

OrderItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Order,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: MenuItem,
        key: "id",
        onDelete: "CASCADE"
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: true,
    modelName: "OrderItem",
    tableName: "order_item",
  }
);

OrderItem.associate = (models) => {
  // OrderItem.belongsTo(Order, {
  //   foreignKey: "order_id",
  //   as: "Order",
  //   targetKey: "id",
  // });
  // OrderItem.belongsTo(MenuItem, {
  //   as: "MenuItem",
  //   foreignKey: "item_id",
  //   targetKey: "id",
  // });
}

OrderItem.beforeCreate(async (orderItem, options) => {
  if (!orderItem.quantity || orderItem.quantity < 1) {
    throw new Error("Quantity is required and must be at least 1");
  }
});

module.exports = OrderItem;
