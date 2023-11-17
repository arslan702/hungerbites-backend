const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Staff = require('./staff.model')

class StaffMonthlySalary extends Model {}

StaffMonthlySalary.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    staff_id: {
      references: {
        model: Staff,
        key: "id",
      },
      type: DataTypes.INTEGER, // Change to INTEGER as it should reference the primary key of Staff
      allowNull: false,
    },
    month: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_salary: {
      type: DataTypes.FLOAT, // Change to FLOAT or DECIMAL to store the total salary for the month
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "StaffMonthlySalary",
    tableName: "staff_monthly_salary", // Define your desired table name
    timestamps: true,
  }
);

StaffMonthlySalary.belongsTo(Staff, {
  foreignKey: "staff_id",
  as: "Staff",
  targetKey: "id",
});

module.exports = StaffMonthlySalary;
