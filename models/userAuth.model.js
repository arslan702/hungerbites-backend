const { Model, DataTypes, STRING, Sequelize } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcrypt");
class UserAuthentication extends Model {}

UserAuthentication.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: "unique_email",
        msg: "Email already exists",
      },
      validate: {
        isEmail: true,
      },
    },
    image_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    address: {
      type: STRING,
      allowNull: true,
    },
    latitude: {
      type: STRING,
      allowNull: true,
    },
    longitude: {
      type: STRING,
      allowNull: true,
    },
    contactNumber: {
      type: STRING,
      allowNull: true,
    },
    status : {
      type: STRING,
      allowNull: false,
      defaultValue: 'active',
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      len: [6, 60],
      lowercase: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user',
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
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
    modelName: "UserAuthentication",
    tableName: "user_authentication",
    timestamps: true,
  }
);

UserAuthentication.beforeCreate(async (user, options) => {
  if (!user.email) {
    throw new Error("Email is required");
  }
  if (!user.password) {
    throw new Error("Password is required");
  }
  if (user.changed("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

module.exports = UserAuthentication;
