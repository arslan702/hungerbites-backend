/*
Discounts:
•	id (Primary Key)
•	product_id (Foreign Key to Products table)
•	discount_amount
•	start_date
•	end_date
*/

const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const MenuItem = require("./menuItems.model");

class Discount extends Model {}

Discount.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    menuItem_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: MenuItem,
        key: "id",
      },

      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    discount_amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
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
    timestamps: true,
    modelName: "Discount",
    tableName: "discount",
  }
);

Discount.belongsTo(MenuItem, {
  foreignKey: "menuItem_id",
  as: "MenuItem",
  targetKey: "id",
});

Discount.beforeCreate(async (discount, options) => {
  if (!discount.discount_amount || discount.discount_amount < 0) {
    throw new Error(
      "Discount amount is required and must be a positive number"
    );
  }
  if (!discount.start_date || !discount.end_date) {
    throw new Error("Start date and end date are required");
  }
  if (discount.start_date >= discount.end_date) {
    throw new Error("Start date must be before end date");
  }
});

module.exports = Discount;
