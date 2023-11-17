const router = require("express").Router();

const orderController = require("../controllers/orderController");

router.post("/", orderController.createOrder);

router.get("/", orderController.getAllOrders);

router.get("/orderamount", orderController.getOrdersAmount);

router.get("/ordernumber", orderController.getOrdersNumber);

router.get("/allstatus", orderController.getAllStatusOrders);

router.get("/delivered", orderController.getDeliveredOrders);

router.get("/pending", orderController.getPendingOrders);

router.get("/profit", orderController.getOrdersProfit);

router.get("/total", orderController.getTotalOrders);

router.get("/user/:id", orderController.getOrdersByuserId);

router.get("/:id", orderController.getOrderById);

router.put("/:id", orderController.updateOrder);

router.delete("/:id", orderController.deleteOrder);

module.exports = router;
