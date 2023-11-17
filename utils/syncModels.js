// models
const UserAuth = require("../models/userAuth.model");

const Category = require("../models/category.model");
const MenuItem = require("../models/menuItems.model");
const dineOrders = require("../models/dineOrders.model");
const Discount = require("../models/discount.model");
const Review = require("../models/review.model");
const Invoice = require("../models/invoice.model");
const ShippingAddress = require("../models/shippingAddress.model");
const Order = require("../models/order.model");
const DineOrder = require("../models/dineOrders.model");
const OrderItem = require("../models/orderItem.model");
const ShoppingCart = require("../models/shoppingCart.model");
const ShoppingCartItem = require("../models/shoppingCartItem.model");
const FoodPreparation = require("../models/foodPreparation.model");
const MonthlyProfits = require("../models/monthlyProfits.model");
const Sales = require("../models/sales.model");
const ShiftCharges = require("../models/shiftCharges.model");
const Staff = require("../models/staff.model");
const StaffWorkingHours = require("../models/staffWorkingHours.model");
const Expenses = require("../models/expenses.model");
const Salary = require("../models/salary.model");

const sequelize = require("../config/database");

async function syncModels() {
  try {
    await sequelize.sync();
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing models:", error);
  }
}

module.exports = {
  syncModels,
};
