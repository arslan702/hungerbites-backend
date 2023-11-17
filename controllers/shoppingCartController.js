const ShoppingCart = require("../models/shoppingCart.model");
const UserAuthentication = require("../models/userAuth.model");

// Function to create a new Shopping cart
exports.createShoppingCart = async (req, res) => {
  try {
    const { user_id, auth_user_id } = req.body;
    const shoppingCart = await ShoppingCart.create({
      user_id,
      auth_user_id,
    });
    res.status(200).json(shoppingCart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Function to get an shopping cart by ID
exports.getShoppingCartById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const shoppingCart = await ShoppingCart.findByPk(id, {
      include: [
        { model: UserAuthentication, as: "UserAuthentication" },
        {
          model: UserAuthentication,
          as: "UserAuthentication",
          attributes: ["id", "email", "role"],
        },
      ],
    });
    if (!shoppingCart) {
      return res.status(400).json({ message: "Shopping Cart not found" });
    }
    res.status(200).json(shoppingCart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// get cart by user id.
exports.getShoppingCartByAuthId = (req, res) => {
  const id = req.params.userId;
  console.log({id})
  ShoppingCart.findOne({auth_user_id: id})
  .then((cart) => {
    if (!cart) {
      res.status(404).send(`Cart with this user id ${id} not found.`)
      return;
    }
    res.status(200).json(cart);
  })
  .catch((error) => {
    res.status(500).json(error.message);
  });
}

// Funciton to update an existing order
exports.updateShoppingCart = async (req, res) => {
  const id = parseInt(req.params.id);
  const { user_id } = req.body;
  try {
    const shoppingCart = await ShoppingCart.findByPk(id);
    if (shoppingCart) {
      shoppingCart.user_id = user_id;
      await shoppingCart.save();
      res.status(200).json(shoppingCart);
    } else {
      res.status(404).json({ message: "Shopping cart not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to delete an order by ID
exports.deleteShoppingCart = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const shoppingCart = await ShoppingCart.findByPk(id);
    if (shoppingCart) {
      await shoppingCart.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Shopping cart not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
