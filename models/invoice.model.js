/*
Invoices:
•	id (Primary Key)
•	order_id (Foreign Key to Orders table)
•	invoice_date
•	total_amount
•	payment_status (enum: 'pending', 'paid')
*/

const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Order = require("./order.model");
const UserAuthentication = require("./userAuth.model");

class Invoice extends Model {}

Invoice.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    auth_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserAuthentication,
        key: "id",
      },

      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("collected", "outstanding"),
      allowNull: false,
    },
    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
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
    modelName: "Invoice",
    tableName: "invoice",
    timestamps: true,
    underscored: true,
  }
);

Invoice.belongsTo(Order, {
  foreignKey: "order_id",
  as: "Order",
  targetKey: "id",
});

Invoice.belongsTo(UserAuthentication, {
  foreignKey: "auth_user_id",
  as: "UserAuthentication",
  targetKey: "id",
});

Invoice.beforeCreate(async (invoice, options) => {
  if (!invoice.order_id) {
    throw new Error("Order ID is required");
  }
  if (!invoice.amount || invoice.amount < 0) {
    throw new Error("Total amount is required and must be a positive number");
  }
});

module.exports = Invoice;
