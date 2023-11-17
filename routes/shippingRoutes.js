const router = require("express").Router();

const shippingController = require("../controllers/shippingController");

router.post("/", shippingController.createShippingAddress);

router.get("/", shippingController.getAllAddresses);

router.get("/:id", shippingController.getAddressById);

router.get("/user/:auth_user_id", shippingController.getAddressByUserId);

router.put("/:id", shippingController.updateShippingAddress);

router.delete("/:id", shippingController.deleteShippingAddress);

module.exports = router;
