/*Orders:
•	id (Primary Key)
•	user_id (Foreign Key to UserProfile table)
•	order_date
•	total_amount
•	status (enum: 'pending', 'processing', 'shipped', 'delivered', 'cancelled')
*/

const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UserAuthentication = require("./userAuth.model");
const MenuItems = require("./menuItems.model");
// const OrderItem = require("./orderItem.model");

class DineOrder extends Model {}

DineOrder.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
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
    restaurant: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    order_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    persons: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    order_time: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    menu_items: {
        type: DataTypes.ARRAY(DataTypes.STRING),
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
    modelName: "DineOrder",
    tableName: "dineOrder",
  }
);

DineOrder.belongsTo(UserAuthentication, {
  foreignKey: "auth_user_id",
  as: "UserAuthentication",
  targetKey: "id",
});


module.exports = DineOrder;
