const UserAuthentication = require("../models/userAuth.model");
const ShippingAddress = require("../models/shippingAddress.model");

exports.getAllAddresses = async (req, res) => {
  try {
    const shippingAddress = await ShippingAddress.findAll({
      include: [
        {
          model: UserAuthentication,
          as: "UserAuthentication",
        },
      ],
    });
    res.status(200).json(shippingAddress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAddressById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const shippingAddress = await ShippingAddress.findByPk(id, {
      include: [
        {
          model: UserAuthentication,
          as: "UserAuthentication",
          attributes: ["id", "name", "email"],
        },
      ],
    });
    if (shippingAddress) {
      res.status(200).json(shippingAddress);
    } else {
      res.status(404).json({ message: "Review not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAddressByUserId = async (req, res) => {
  const auth_user_id = parseInt(req.params.auth_user_id);
  try {
    const shippingAddress = await ShippingAddress.findOne({
      where: { auth_user_id },
    });
    if (shippingAddress) {
      res.status(200).json(shippingAddress);
    } else {
      res.status(404).json({ message: "Address not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.createShippingAddress = async (req, res) => {
  const { auth_user_id, name, address, city, state, phone_number } = req.body;
  try {
    const shippingAddress = await ShippingAddress.create({
      auth_user_id,
      name,
      address,
      city,
      state,
      phone_number,
    });
    res.status(201).json(shippingAddress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateShippingAddress = async (req, res) => {
  const id = parseInt(req.params.id);
  // const { auth_user_id, name, address, city, state, phone_number, area_id } = req.body;
  try {
    const shippingAddress = await ShippingAddress.findByPk(id);
    if (shippingAddress) {
      // shippingAddress.auth_user_id = auth_user_id;
      // shippingAddress.name = name;
      // shippingAddress.address = address;
      // shippingAddress.city = city;
      // shippingAddress.state = state;
      // shippingAddress.phone_number = phone_number;
      // shippingAddress.area_id = area_id;
      // await shippingAddress.save();
      await shippingAddress.update(req.body);
      res.status(200).json(shippingAddress);
    } else {
      res.status(404).json({ message: "Shipping Address not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteShippingAddress = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const shippingAddress = await ShippingAddress.findByPk(id);
    if (shippingAddress) {
      await shippingAddress.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ message: "ShippingAddress not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
