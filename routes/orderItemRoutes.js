const router = require("express").Router();

const orderItemController = require("../controllers/orderItemController");

router.post("/", orderItemController.createOrderItem);

router.get("/", orderItemController.getOrderItems);

router.get("/:id", orderItemController.getOrderItemById);

router.get("/order/:orderId", orderItemController.getOrdersByOrderId);

router.get("/order/item/:itemid", orderItemController.getOrdersByItemId);

router.put("/:id", orderItemController.updateOrderItem);

router.delete("/:id", orderItemController.deleteOrderItem);

module.exports = router;
