const router = require("express").Router();

const paymentController = require("../controllers/paymentController");

router.post("/", paymentController.createPayment);

// router.get("/", paymentController.getAllPayments);

// router.get("/:id", paymentController.getPaymentById);

// router.delete("/:id", paymentController.deletePayment);

module.exports = router;
