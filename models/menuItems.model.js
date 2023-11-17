/*
Products:
•	id (Primary Key)
•	name
•	description
•	price
•	image_url
•	brand_id (Foreign Key to Brands table)
•	category_id (Foreign Key to Categories table)
•	sub_category_id (Foreign Key to Sub_Categories table)
•	sku
*/
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const UserAuthentication = require("./userAuth.model");
// const OrderItem = require("./orderItem.model");
const Category = require("./category.model");

class MenuItems extends Model {}

MenuItems.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
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
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    image_url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category,
        key: "id",
      },

      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
    modelName: "MenuItem",
    tableName: "menuitem",
  }
);

MenuItems.belongsTo(UserAuthentication, {
  foreignKey: "auth_user_id",
  as: "UserAuthentication",
  targetKey: "id",
});

MenuItems.belongsTo(Category, {
  foreignKey: "category_id",
  as: "Category",
  targetKey: "id",
});

// MenuItems.hasMany(OrderItem, { foreignKey: 'item_id' });

module.exports = MenuItems;
