const DineOrder = require("../models/dineOrders.model");
const UserAuthentication = require("../models/userAuth.model");

exports.createOrder = async (req, res) => {
  try {
    const {
      auth_user_id,
      restaurant,
      order_date,
      persons,
      order_time,
      menu_items,
    } = req.body;

    const order = await DineOrder.create({
      auth_user_id,
      restaurant,
      order_date,
      persons,
      order_time,
      menu_items,
    });

    res.status(201).json({
      success: true,
      message: "Order created",
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await DineOrder.findAll({
      include: [{ model: UserAuthentication ,as: 'UserAuthentication' }],
    });
    res.status(200).json({
      success: true,
      message: "Orders retrieved",
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

exports.getOrderById = async (req, res) => {
  const orderId = req.params.id;

  try {
    const order = await DineOrder.findByPk(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "Order retrieved",
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

exports.updateOrder = async (req, res) => {
  const orderId = req.params.id;
  const updatedData = req.body;

  try {
    const order = await DineOrder.findByPk(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }
    const updatedOrder = await order.update(updatedData);
    res.status(200).json({
      success: true,
      message: "Order updated",
      order: updatedOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

exports.deleteOrder = async (req, res) => {
  const orderId = req.params.id;

  try {
    const order = await DineOrder.findByPk(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }
    await order.destroy();
    res.status(200).json({
      success: true,
      message: "Order deleted",
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};
