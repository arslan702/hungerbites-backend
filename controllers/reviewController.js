const Review = require("../models/review.model");
const MenuItem = require("../models/menuItems.model");

const UserAuthentication = require("../models/userAuth.model");

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [
        { model: MenuItem, as: "MenuItem" },
        {
          model: UserAuthentication,
          as: "UserAuthentication",
        },
      ],
    });
    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getReviewById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const review = await Review.findByPk(id, {
      include: [
        { model: MenuItem, as: "MenuItem" },
        {
          model: UserAuthentication,
          as: "UserAuthentication",
          attributes: ["id", "name", "email"],
        },
      ],
    });
    if (review) {
      res.status(200).json(review);
    } else {
      res.status(404).json({ message: "Review not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getReviewsByUserId = async (req, res) => {
  const userId = req.params.userId;

  try {
    const reviews = await Review.findAll({
      where: { auth_user_id: userId },
      include: [
        { model: UserAuthentication, as: "UserAuthentication" },
        { model: MenuItem, as: "MenuItem" },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Reviews retrieved successfully",
      data: reviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve reviews",
      error: error.message,
    });
  }
};

exports.getReviewsByMenuItemId = async (req, res) => {
  const menuitemId = req.params.menuitemId;

  try {
    const reviews = await Review.findAll({
      where: { item_id: menuitemId },
      include: [
        { model: UserAuthentication, as: "UserAuthentication" },
        { model: MenuItem, as: "MenuItem" },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Reviews retrieved successfully",
      data: reviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve reviews",
      error: error.message,
    });
  }
};

exports.createReview = async (req, res) => {
  const { item_id, user_id, rating, review_text, auth_user_id } = req.body;
  try {
    const review = await Review.create({
      item_id,
      user_id,
      rating,
      review_text,
      auth_user_id,
    });
    res.status(201).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};

exports.updateReview = async (req, res) => {
  const id = parseInt(req.params.id);
  const { item_id, user_id, rating, review_text } = req.body;
  try {
    const review = await Review.findByPk(id);
    if (review) {
      review.item_id = item_id;
      review.user_id = user_id;
      review.rating = rating;
      review.review_text = review_text;
      await review.save();
      res.status(200).json(review);
    } else {
      res.status(404).json({ message: "Review not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteReview = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const review = await Review.findByPk(id);
    if (review) {
      await review.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Review not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
