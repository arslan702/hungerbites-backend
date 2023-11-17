const router = require("express").Router();

const tradeOfferController = require("../controllers/tradeOfferController");

router.post("/", tradeOfferController.createTradeOffer);

router.get("/", tradeOfferController.getAllTradeOffers);

router.get("/valid", tradeOfferController.getValidTradeOffers);

router.get("/offertotal", tradeOfferController.getNumberOfOffers);

router.get("/:id", tradeOfferController.getTradeOfferById);

router.put("/:id", tradeOfferController.updateTradeOffer);

router.delete("/:id", tradeOfferController.deleteTradeOffer);

module.exports = router;
