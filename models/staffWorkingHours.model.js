const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcrypt");
class StaffWorkingHours extends Model {}

const Staff = require('./staff.model')

StaffWorkingHours.init(
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
      allowNull: true,
    },
    shift_start_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    shift_end_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    extra_working_time: {
      type: DataTypes.STRING,
      allowNull: true,
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
    modelName: "StaffWorkingHours",
    tableName: "staffWorkingHours",
    timestamps: true,
  }
);

StaffWorkingHours.belongsTo(Staff, {
  foreignKey: "staff_id",
  as: "Staff",
  targetKey: "id",
});
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

module.exports = StaffWorkingHours;