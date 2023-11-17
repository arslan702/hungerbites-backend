/*
// Category:
// •	id (Primary Key)
// •	name
// 
*/

const { Model, DataTypes, Sequelize, STRING } = require("sequelize");
const sequelize = require("../config/database");

class Category extends Model {}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 255],
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
    modelName: "Category",
    tableName: "category",
  }
);

// Define the Product model
const MenuItem = sequelize.define("MenuItem", {
  name: Sequelize.STRING,
});

// Define the association between the two models
Category.hasMany(MenuItem, { foreignKey: "category_id", as: "MenuItem" });
MenuItem.belongsTo(Category, { foreignKey: "category_id", as: "category" });

// Add the beforeCreate hook
Category.beforeCreate(async (category) => {
  try {
    // Validate the category name
    if (!category.name) {
      throw new Error("Category name cannot be empty");
    }

    // Check if a category with this name already exists
    const existingCategory = await Category.findOne({
      where: { name: category.name },
    });
    if (existingCategory) {
      throw new Error("Category with this name already exists");
    }
  } catch (err) {
    // Throw a custom error message
    throw new Error(`Error creating category: ${err.message}`);
  }
});

Category.beforeUpdate(async (category) => {
  // Add your custom error handling logic here
  if (!area.name) {
    throw new Error("Area name cannot be empty");
  }
  const existingCategory = await Category.findOne({
    where: { name: category.name },
  });
  if (existingCategory) {
    throw new Error("Category with this name already exists");
  }
});

module.exports = Category;
