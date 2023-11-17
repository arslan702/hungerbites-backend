const UserAuthentication = require("../models/userAuth.model");
const Area = require("../models/area.model");
const Contact = require("../models/contact.model");

exports.getAllContacts = async (req, res) => {
  try {
    const contact = await Contact.findAll({
      include: [
        {
          model: UserAuthentication,
          as: "UserAuthentication",
        },
        { model: Area, as: "Area" },
      ],
    });
    res.status(200).json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getContactsById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const contact = await Contact.findByPk(id, {
      include: [
        {
          model: UserAuthentication,
          as: "UserAuthentication",
          attributes: ["id", "name", "email"],
        },
        { model: Area, as: "Area" },
      ],
    });
    if (contact) {
      res.status(200).json(contact);
    } else {
      res.status(404).json({ message: "Contact not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getContactByUserId = async (req, res) => {
  const auth_user_id = parseInt(req.params.auth_user_id);
  try {
    const contactAddress = await Contact.findOne({
      where: { auth_user_id },
    });
    if (contactAddress) {
      res.status(200).json(contactAddress);
    } else {
      res.status(404).json({ message: "Contact not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.createContactAddress = async (req, res) => {
  const { auth_user_id, name, address, city, state, phone_number, area_id } = req.body;
  try {
    const contact = await Contact.create({
      auth_user_id,
      name,
      address,
      city,
      state,
      phone_number,
      area_id
    });
    res.status(201).json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateContact = async (req, res) => {
  const id = parseInt(req.params.id);
  const { auth_user_id, name, address, city, state, phone_number, area_id } = req.body;
  try {
    const contact = await Contact.findByPk(id);
    if (contact) {
      contact.auth_user_id = auth_user_id;
      contact.name = name;
      contact.address = address;
      contact.city = city;
      contact.state = state;
      contact.phone_number = phone_number;
      contact.area_id = area_id;
      await contact.save();
      res.status(200).json(contact);
    } else {
      res.status(404).json({ message: "Contact Address not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteContact = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const contact = await Contact.findByPk(id);
    if (contact) {
      await contact.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Contact not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
