const router = require("express").Router();

const shoppingCartController = require("../controllers/shoppingCartController");

router.post("/", shoppingCartController.createShoppingCart);

router.get("/:id", shoppingCartController.getShoppingCartById);

router.get("/auth/:userId", shoppingCartController.getShoppingCartByAuthId);

router.put("/:id", shoppingCartController.updateShoppingCart);

router.delete("/:id", shoppingCartController.deleteShoppingCart);

module.exports = router;
