const router = require("express").Router();

const shoppingCartItemController = require("../controllers/shoppingCartItemController");

router.post("/", shoppingCartItemController.createShoppingCartItem);

router.get("/", shoppingCartItemController.getAllShoppingCartItems);

router.get("/:id", shoppingCartItemController.getShoppingCartItemById);

router.get("/cart/:cartId", shoppingCartItemController.getShoppingCartItemByCartId);

router.put("/:id", shoppingCartItemController.updateShoppingCartItem);

router.delete("/:id", shoppingCartItemController.deleteShoppingCartItem);

module.exports = router;
