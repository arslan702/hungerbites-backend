const TradeOffer = require("../models/tradeOffer.model");
const Product = require("../models/product.model");
const { Op } = require("sequelize");

// Function to get all the tradeoffers that are
exports.getAllTradeOffers = async (req, res) => {
  try {
    const tradeOffers = await TradeOffer.findAll({
      include: { model: Product, as: "Product" },
    });
    res.status(200).json(tradeOffers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getValidTradeOffers = async (req, res) => {
  const currentDate = new Date();
  try {
    const tradeOffers = await TradeOffer.findAll({
      where: {
        start_date: { [Op.lte]: currentDate },
        end_date: { [Op.gte]: currentDate },
      },
      include: { model: Product, as: "Product" },
    });
    res.status(200).json(tradeOffers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getNumberOfOffers = async (req, res) => {
  const currentDate = new Date();
  try {
    const total = await TradeOffer.findAndCountAll({
      where: {
        end_date: { [Op.gte]: currentDate },
      }
    })
    const offerTotal = total.count;
    res.status(200).json(offerTotal);
  } catch (error) {
    res.status(500).json(error)
  }
}

exports.getTradeOfferById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const tradeOffer = await TradeOffer.findByPk(id, {
      include: { model: Product, as: "product" },
    });
    if (tradeOffer) {
      res.status(200).json(tradeOffer);
    } else {
      res.status(404).json({ message: "Trade offer not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.createTradeOffer = async (req, res) => {
  const { product_id, offer_amount, start_date, end_date } = req.body;
  try {
    const tradeOffer = await TradeOffer.create({
      product_id,
      offer_amount,
      start_date,
      end_date,
    });
    res.status(201).json(tradeOffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateTradeOffer = async (req, res) => {
  const id = parseInt(req.params.id);
  const { product_id, offer_amount, start_date, end_date } = req.body;
  try {
    const tradeOffer = await TradeOffer.findByPk(id);
    if (tradeOffer) {
      tradeOffer.product_id = product_id;
      tradeOffer.offer_amount = offer_amount;
      tradeOffer.start_date = start_date;
      tradeOffer.end_date = end_date;
      await tradeOffer.save();
      res.status(200).json(tradeOffer);
    } else {
      res.status(404).json({ message: "Trade offer not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteTradeOffer = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const tradeOffer = await TradeOffer.findByPk(id);
    if (tradeOffer) {
      await tradeOffer.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Trade offer not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
