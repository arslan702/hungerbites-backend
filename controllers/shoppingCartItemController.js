const ShoppingCart = require("../models/shoppingCart.model");
const ShoppingCartItem = require("../models/shoppingCartItem.model");
const Discount = require("../models/discount.model");
const MenuItems = require("../models/menuItems.model");
const UserAuthentication = require("../models/userAuth.model");

exports.getAllShoppingCartItems = async (req, res) => {
  try {
    const shoppingCartItems = await ShoppingCartItem.findAll({
      include: [
        { model: MenuItems, as: "MenuItem" },
        { model: UserAuthentication, as: "UserAuthentication"},
        { model: ShoppingCart, as: "ShoppingCart"},
      ],
    });
    res.status(200).json(shoppingCartItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getShoppingCartItemById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const shoppingCartItem = await ShoppingCartItem.findByPk(id, {
      include: [
        { model: MenuItems, as: "MenuItem" },
        { model: ShoppingCart, as: "shopping_cart" },
      ],
    });
    if (shoppingCartItem) {
      res.status(200).json(shoppingCartItem);
    } else {
      res.status(404).json({ message: "Shopping cart item not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getShoppingCartItemByCartId = async (req, res) => {
  const id = parseInt(req.params.cartId);
  console.log({id})
  try {
    const shoppingCartItem = await ShoppingCartItem.findAll({
      where: { shopping_cart_id: id },
      include: [
        { model: MenuItems, as: "MenuItem", include: { model: UserAuthentication, as: "UserAuthentication" }},
        { model: UserAuthentication, as: "UserAuthentication"},
        { model: ShoppingCart, as: "ShoppingCart" },
        { model: Discount, as: "Discount" },
      ],
    });
    if (shoppingCartItem) {
          res.status(200).json(shoppingCartItem)
    } else {
      res.status(404).json({ message: "Shopping cart item not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.createShoppingCartItem = async (req, res) => {
  const { shopping_cart_id, menuitem_id, quantity, auth_user_id } = req.body;

  console.log(shopping_cart_id, menuitem_id, quantity, auth_user_id);

  try {
    const shoppingCartItem = await ShoppingCartItem.create({
      shopping_cart_id,
      menuitem_id,
      auth_user_id,
      quantity,
    });
    res.status(201).json(shoppingCartItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateShoppingCartItem = async (req, res) => {
  const id = parseInt(req.params.id);
  const { 
    quantity } = req.body;
  try {
    const shoppingCartItem = await ShoppingCartItem.findByPk(id);
    if (shoppingCartItem) {
      shoppingCartItem.quantity = quantity;
      await shoppingCartItem.save();
      res.status(200).json(shoppingCartItem);
    } else {
      res.status(404).json({ message: "Shopping cart item not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteShoppingCartItem = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const shoppingCartItem = await ShoppingCartItem.findByPk(id);
    if (shoppingCartItem) {
      await shoppingCartItem.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Shopping cart item not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
