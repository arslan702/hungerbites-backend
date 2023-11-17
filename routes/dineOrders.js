const router = require("express").Router();

const dineOrderController = require("../controllers/dineOrderController");

router.post("/", dineOrderController.createOrder);

router.get("/", dineOrderController.getOrders);

// router.get("/valid", discountController.getCurrentDiscounts);

// router.get("/discounttotal", discountController.getNumberOfDiscounts);

router.get("/:id", dineOrderController.getOrderById);

// router.get("/p/:id", discountController.getDiscountByProductId);

router.put("/:id", dineOrderController.updateOrder);

router.delete("/:id", dineOrderController.deleteOrder);

module.exports = router;
