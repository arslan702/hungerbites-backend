const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
class ShiftCharges extends Model {}

const Staff = require('./staff.model')

ShiftCharges.init(
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
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    extra_working_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    charge_amount: {
      type: DataTypes.TIME,
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
    modelName: "ShiftCharge",
    tableName: "shiftCharge",
    timestamps: true,
  }
);

// StaffWorkingHours.beforeCreate(async (user, options) => {
//   if (!user.email) {
//     throw new Error("Email is required");
//   }
//   if (!user.password) {
//     throw new Error("Password is required");
//   }
//   if (user.changed("password")) {
//     user.password = await bcrypt.hash(user.password, 10);
//   }
// });

module.exports = ShiftCharges;