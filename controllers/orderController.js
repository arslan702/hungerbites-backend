const Order = require("../models/order.model");
const UserAuthentication = require("../models/userAuth.model");
const { Op, Sequelize } = require('sequelize');
const { sendEmail } = require("../utils/email");

// Function to create a new order
exports.createOrder = async (req, res) => {
  const currentDate = new Date();
  const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('en-US', options);
  try {
    const { auth_user_id, total_amount, status } =
      req.body;
    const order = await Order.create({
      auth_user_id,
      total_amount,
      status,
      order_date: formattedDate,
    });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Function to get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        // { model: Product, as: "Product" },
        { model: UserAuthentication, as: "UserAuthentication" },
      ],
    });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all orders by user id
exports.getOrdersByuserId = async (req, res) => {
  console.log('here')
  try {
    const { id } = req.params;
    // let orderItems = [];
    const orders = await Order.findAll({
      where: { auth_user_id: id },
      // include: [
      //   { model: Product, as: "Product" },
      //   { model: Order, as: "Order" },
      // ],
    });
    // if(!orders){
    //   res.status(200).json(orderItems)
    // } else {
    //   for(const order of orders){
    //     const orderItem = await OrderItem.findAll({
    //       where: { order_id: order?.id },
    //       include: [ 
    //       { model: Order, as: "Order" },
    //       { model: Product, as: "Product" },
    //       ]
    //     })
    //     orderItems = orderItems.concat(orderItem)
    //   }
    // }
    // res.status(200).json(orderItems);
    res.status(200).json(orders)
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOrdersAmount = async (req, res) => {
  const result = await Order.findOne({
    attributes: [[Sequelize.fn('sum', Sequelize.col('total_amount')), 'total']],
    where: { status: 'delivered' }
  });
  const totalAmount = result.get('total');

const currentMonth = new Date().getMonth() + 1;
const currentYear = new Date().getFullYear();

const results = await Order.findAll({
  attributes: [
    [
      Sequelize.fn('SUM', Sequelize.col('total_amount')),
      'sum_current_month'
    ],
    [      
      Sequelize.fn('SUM', Sequelize.col('total_amount')),      
      'sum_current_year'    
    ]
  ],
  where: {
    status: 'delivered',
    order_date: {
      [Op.and]: [
        Sequelize.where(Sequelize.fn('DATE_PART', 'month', Sequelize.col('order_date')), currentMonth),
        Sequelize.where(Sequelize.fn('DATE_PART', 'year', Sequelize.col('order_date')), currentYear)
      ]
    }
  }
});

const { sum_current_month } = results[0].toJSON();
res.status(200).json({ sum_current_month, totalAmount });
}

exports.getOrdersProfit = async (req, res) => {
  const deliver = await Order.findOne({
    attributes: [[Sequelize.fn('sum', Sequelize.col('total_amount')), 'total']],
    where: { status: 'delivered' }
  });
  const delivered = deliver.get('total');

  const cancel = await Order.findOne({
    attributes: [[Sequelize.fn('sum', Sequelize.col('total_amount')), 'total']],
    where: { status: 'cancelled' }
  });
  const canceled = cancel.get('total');

  const profit = Number(delivered) - Number(canceled);
  res.status(200).json({profit, delivered, canceled})
}

exports.getOrdersNumber = async (req, res) => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const year = await Order.findAndCountAll({
    where: {
      order_date: {
        [Op.and]: [
          Sequelize.where(Sequelize.fn('DATE_PART', 'year', Sequelize.col('order_date')), currentYear)
        ]
      }
    }
  })
  const thisyear = year.count;
  const results = await Order.findAndCountAll({
    where: {
      order_date: {
        [Op.and]: [
          Sequelize.where(Sequelize.fn('DATE_PART', 'month', Sequelize.col('order_date')), currentMonth),
        ]
      }
    }
  });
  
  const ordersCount = results.count;
  res.status(200).json({ ordersCount, thisyear });
}

exports.getDeliveredOrders = async (req, res) => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const delivered = await Order.findAll({
    include: [
      { model: UserAuthentication, as: "UserAuthentication" },
    ],
    where: {
      status: 'delivered',
    }
  })
  const year = await Order.findAndCountAll({
    where: {
      status: 'delivered',
      order_date: {
        [Op.and]: [
          Sequelize.where(Sequelize.fn('DATE_PART', 'year', Sequelize.col('order_date')), currentYear)
        ]
      }
    }
  })
  const thisyear = year.count;
  const results = await Order.findAndCountAll({
    where: {
      status: 'delivered',
      order_date: {
        [Op.and]: [
          Sequelize.where(Sequelize.fn('DATE_PART', 'month', Sequelize.col('order_date')), currentMonth),
        ]
      }
    }
  });
  
  const ordersCount = results.count;
  res.status(200).json({ ordersCount, thisyear, delivered });
}

// get pending orders
exports.getPendingOrders = async (req, res) => {
  const pending = await Order.findAll({
    include: [
      { model: UserAuthentication, as: "UserAuthentication" },
    ],
    where: {
      status : {
        [Op.notIn]: ["delivered", "cancelled"]
      }
    }
  })
  res.status(200).json({pending})
}

// total number of orders
exports.getTotalOrders = async (req, res) => {
  const total = await Order.findAndCountAll();
  res.status(200).json(total?.count)
}

// get number of all types of orders
exports.getAllStatusOrders = async (req, res) => {
  const delivered = await Order.findAndCountAll({
    where: {
      status: 'delivered',
    }
  })
  const deliveredOrders = delivered?.count;

  const pending = await Order.findAndCountAll({
    where: {
      status: 'pending',
    }
  })
  const pendingOrders = pending?.count;

  const cancelled = await Order.findAndCountAll({
    where: {
      status: 'cancelled',
    }
  })
  const cancelledOrders = cancelled?.count;

  res.status(200).json({deliveredOrders, pendingOrders, cancelledOrders})
}

// Function to get an order by ID
exports.getOrderById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const order = await Order.findByPk(id, {
      include: [{ model: UserAuthentication }],
    });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Function to update an existing order
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    const user = await UserAuthentication.findByPk(order?.auth_user_id);
    const { email } = user;
    const { status } = req.body;
    order.status = status;
    await order.save();
    sendEmail(email, 'Your Order Update', `Your order is ${status}`);
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Function to delete an order by ID
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    await order.destroy();
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
