/*Shopping_Cart_Items:
•	id (Primary Key)
•	shopping_cart_id (Foreign Key to Shopping_Carts table)
•	product_id (Foreign Key to Products table)
•	quantity
*/

const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const ShoppingCart = require("./shoppingCart.model");
const Discount = require("./discount.model");
const MenuItems = require("./menuItems.model");
const UserAuthentication = require("./userAuth.model");

class ShoppingCartItem extends Model {}

ShoppingCartItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    shopping_cart_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ShoppingCart,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    menuitem_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: MenuItems,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    auth_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserAuthentication,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    quantity: {
      type: DataTypes.INTEGER,
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
    modelName: "ShoppingCartItem",
    tableName: "shopping_cart_item",
  }
);

ShoppingCartItem.belongsTo(ShoppingCart, {
  foreignKey: "shopping_cart_id",
  as: "ShoppingCart",
  targetKey: "id",
});

ShoppingCartItem.belongsTo(MenuItems, {
  foreignKey: "menuitem_id",
  as: "MenuItem", 
  targetKey: "id",
});

ShoppingCartItem.belongsTo(UserAuthentication, {
  foreignKey: "auth_user_id",
  as: "UserAuthentication",
  targetKey: "id",
})
ShoppingCartItem.belongsTo(Discount, {
  foreignKey: "menuitem_id",
  as: "Discount",
  targetKey: "menuItem_id"
});

ShoppingCartItem.beforeCreate((item, options) => {
  return ShoppingCartItem.findOne({
    where: {
      shopping_cart_id: item.shopping_cart_id,
      menuitem_id: item.menuitem_id,
    },
  }).then((existingItem) => {
    if (existingItem) {
      throw new Error("Shopping cart item already exists");
    }
  });
});

module.exports = ShoppingCartItem;
