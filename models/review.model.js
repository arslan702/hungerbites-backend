/*Reviews:
•	id (Primary key)
•	product_id (Foreign Key to Products table)
•	user_id (Foreign Key to UserProfile table)
•	rating (max 5 integer)
•	review_text
•	date
*/
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const UserAuthentication = require("./userAuth.model");

const MenuItem = require("./menuItems.model");

class Review extends Model {}

Review.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 5,
      },
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
    review_text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    item_id: {
      reference: {
        model: MenuItem,
        key: "id",
      },
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
    modelName: "Review",
    tableName: "review",
  }
);

Review.belongsTo(MenuItem, {
  foreignKey: "item_id",
  targetKey: "id",
  as: "MenuItem",
});

Review.belongsTo(UserAuthentication, {
  foreignKey: "auth_user_id",
  targetKey: "id",
  as: "UserAuthentication",
});

Review.beforeCreate(async (review) => {
  try {
    const existingReview = await Review.findOne({
      where: {
        item_id: review.item_id,
        auth_user_id: review.auth_user_id,
      },
    });

    if (existingReview) {
      throw new Error("Review for this product already exists");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

module.exports = Review;
