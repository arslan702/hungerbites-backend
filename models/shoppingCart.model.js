/* Shopping_Carts:
•	id (Primary Key)
•	user_id (Foreign Key to UserProfile table)
*/

const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UserAuthentication = require("./userAuth.model");

class ShoppingCart extends Model {}

ShoppingCart.init(
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
    timestamps: true,
    sequelize: sequelize,
    modelName: "ShoppingCart",
    tableName: "shopping_cart",
  }
);

ShoppingCart.belongsTo(UserAuthentication, {
  foreignKey: "auth_user_id",
  as: "UserAuthentication",
  targetKey: "id",
});

// Add error handling using hooks
ShoppingCart.beforeCreate(async (cart, options) => {
  try {
    const existingCart = await ShoppingCart.findOne({
      where: { auth_user_id: cart.auth_user_id },
    });
    if (existingCart) {
      throw new Error("Customer already has an existing shopping cart");
    }
  } catch (err) {
    throw err;
  }
});

module.exports = ShoppingCart;
