const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcrypt");
class MonthlyProfits extends Model {}

MonthlyProfits.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    month: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    year: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    revenue: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    expenses: {
      type: DataTypes.INTEGER,
    },
    profit: {
      type: DataTypes.INTEGER,
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
    modelName: "MonthlyProfilts",
    tableName: "monthlyprofits",
    timestamps: true,
  }
);

module.exports = MonthlyProfits;
