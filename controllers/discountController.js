const { Op } = require("sequelize");
const Discount = require("../models/discount.model");
const MenuItem = require("../models/menuItems.model");

exports.getCurrentDiscounts = (req, res) => {
  const currentDate = new Date();
  Discount.findAll({
    include: { model: MenuItem, as: "MenuItem" },
    where: {
      start_date: {
        [Op.lte]: currentDate,
      },
      end_date: {
        [Op.gte]: currentDate,
      },
    },
  })
    .then((discounts) => {
      res.status(200).json(discounts);
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
};

// Get all discounts
exports.getDiscounts = (req, res) => {
  Discount.findAll({
    include: { model: MenuItem, as: "MenuItem" },
  })
    .then((discounts) => {
      res.status(200).json(discounts);
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
};

// number of products in discount
exports.getNumberOfDiscounts = async (req, res) => {
  const currentDate = new Date();
  try {
    const total = await Discount.findAndCountAll({
      where: {
        end_date: { [Op.gte]: currentDate },
      }
    })
    const discountTotal = total.count;
    res.status(200).json(discountTotal);
  } catch (error) {
    res.status(500).json(error)
  }
}

// Get a single discount by id
exports.getDiscountById = (req, res) => {
  const id = req.params.id;
  Discount.findByPk(id)
    .then((discount) => {
      if (!discount) {
        res.status(404).send(`Discount with id ${id} not found`);
        return;
      }
      res.status(200).json(discount);
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
};

// Get a single discount by product id
exports.getDiscountByProductId = (req, res) => {
  const id = req.params.id;
  console.log({id})
  Discount.findOne({
    where: {menuItem_id: id},
  })
    .then((discount) => {
      if (!discount) {
        // res.status(404).send(`Discount with product id ${id} not found`);
        res.status(201).json(0);
        return;
      }
      res.status(200).json(discount);
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
};

// Create a new discount
exports.createDiscount = (req, res) => {
  const { menuItem_id, discount_amount, start_date, end_date } = req.body;
  Discount.create({ menuItem_id, discount_amount, start_date, end_date })
    .then((discount) => {
      res.status(201).send(`Discount added with ID: ${discount.id}`);
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
};

// Update an existing discount
exports.updateDiscount = (req, res) => {
  const id = req.params.id;
  const { menuItem_id, discount_amount, start_date, end_date } = req.body;
  Discount.update(
    { menuItem_id, discount_amount, start_date, end_date },
    { where: { id } }
  )
    .then((result) => {
      if (result[0] === 0) {
        res.status(404).send(`Discount with id ${id} not found`);
        return;
      }
      res.status(200).send(`Discount modified with ID: ${id}`);
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
};

// Delete a discount
exports.deleteDiscount = (req, res) => {
  const id = req.params.id;
  Discount.destroy({ where: { id } })
    .then((result) => {
      if (result === 0) {
        res.status(404).send(`Discount with id ${id} not found`);
        return;
      }
      res.status(200).send(`Discount deleted with ID: ${id}`);
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
};
