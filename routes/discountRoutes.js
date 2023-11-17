const router = require("express").Router();

const discountController = require("../controllers/discountController");

router.post("/", discountController.createDiscount);

router.get("/", discountController.getDiscounts);

router.get("/valid", discountController.getCurrentDiscounts);

router.get("/discounttotal", discountController.getNumberOfDiscounts);

router.get("/:id", discountController.getDiscountById);

router.get("/p/:id", discountController.getDiscountByProductId);

router.put("/:id", discountController.updateDiscount);

router.delete("/:id", discountController.deleteDiscount);

module.exports = router;
