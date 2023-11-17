/*
Shipping_Addresses:
•	id (Primary Key)
•	user_id (Foreign Key to UserProfile table)
•	name
•	address
•	phone_number
•	area_id (Foreign Key to Areas table)

*/
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const UserAuthentication = require("./userAuth.model");
class ShippingAddress extends Model {}

ShippingAddress.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    city: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    state: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
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
    modelName: "ShippingAddress",
    tableName: "shipping_address",
    underscored: true,
    timestamps: true,
  }
);

module.exports = ShippingAddress;
