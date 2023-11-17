const router = require("express").Router();
const reviewController = require("../controllers/reviewController");

router.post("/", reviewController.createReview);

router.get("/", reviewController.getAllReviews);

router.get("/:id", reviewController.getReviewById);

router.get("/product/:menuitemId", reviewController.getReviewsByMenuItemId);

router.get("/user/:userId", reviewController.getReviewsByUserId);

router.put("/:id", reviewController.updateReview);

router.delete("/:id", reviewController.deleteReview);

module.exports = router;
