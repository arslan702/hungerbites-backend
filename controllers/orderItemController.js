const Order_Item = require("../models/orderItem.model");

const Order = require("../models/order.model");
const Item = require("../models/menuItems.model");
const MenuItems = require("../models/menuItems.model");

// GET all order items
exports.getOrderItems = async (req, res) => {
  try {
    const order_items = await Order_Item.findAll();
    res.status(200).json(order_items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET a single order item by ID
exports.getOrderItemById = async (req, res) => {
  const id = req.params.id;
  try {
    const order_item = await Order_Item.findOne({ where: { id: id } });
    if (order_item) {
      res.status(200).json(order_item);
    } else {
      res.status(404).json({ error: `Order item with ID ${id} not found` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all orders by order id
exports.getOrdersByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;
    const orderItem = await Order_Item.findAll({
      where: { order_id: orderId },
      // include: [
      // { model: Order, as: "Order" },
      // { model: MenuItems, as: "MenuItem" }],
    });
    res.status(200).json(orderItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all orders by customer id
exports.getOrdersByItemId = async (req, res) => {
  try {
    const { itemId } = req.params;
    const orderItem = await Order_Item.findAll({
      where: { item_id: itemId },
      include: Order,
      Item,
    });
    res.status(200).json(orderItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREATE a new order item
exports.createOrderItem = async (req, res) => {
  const { order_id, item_id, quantity, price } = req.body;
  try {
    const new_order_item = await Order_Item.create({
      order_id,
      item_id,
      quantity,
      price
    });
    res.status(201).json(new_order_item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE an existing order item
exports.updateOrderItem = async (req, res) => {
  const id = req.params.id;
  const { order_id, item_id, quantity } = req.body;
  try {
    const order_item = await Order_Item.findOne({ where: { id: id } });
    if (order_item) {
      const updated_order_item = await order_item.update({
        order_id: order_id,
        item_id: item_id,
        quantity: quantity,
      });
      res.status(200).json(updated_order_item);
    } else {
      res.status(404).json({ error: `Order item with ID ${id} not found` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE an order item
exports.deleteOrderItem = async (req, res) => {
  const id = req.params.id;
  try {
    const order_item = await Order_Item.findOne({ where: { id: id } });
    if (order_item) {
      await order_item.destroy();
      res.status(204).end();
    } else {
      res.status(404).json({ error: `Order item with ID ${id} not found` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
