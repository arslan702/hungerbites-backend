const express = require("express");

const authController = require("../controllers/authController");
const authValidator = require("../validators/authValidator");
const { uploadImageToS3 } = require("../utils/uploadProductImgeToS3");
const { uploadCNICImages } = require("../middlewares/uploadImages");

async function uploadImageMiddleware(req, res, next) {
  // if(!req.files){
  //   req.body.image1 = null;
  //   req.body.image2 = null;
  //   next();
  // }
  const [file1, file2] = await new Promise((resolve, reject) => {
    uploadCNICImages("products", "image1", "image2")(req, res, (err) => {
      if (err) {
        reject(err);
      }
      resolve([req.files["image1"][0], req.files["image2"][0]]);
    });
  });

  // await Promise.all([
  //   uploadImageToS3(file1),
  //   uploadImageToS3(file2)]);
  try {
    const front = await uploadImageToS3(file1);
    req.body.image1 = front;
    const back = await uploadImageToS3(file2);
    req.body.image2 = back;
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }

  next();
}

const router = express.Router();

// Register route
router.post(
  "/register",

  // authValidator.registerValidator,
  // authValidator.validate,
  
  // uploadImageMiddleware,
  authController.register
);

router.post("/registerRestaurant", authController.registerRestaurant)

// Login route
router.post(
  "/login",
  authValidator.loginValidator,
  authValidator.validate,
  authController.login
);

// Forgot password route
router.post(
  "/forgotpassword",
  authValidator.forgotPasswordValidator,
  authValidator.validate,
  authController.forgotPassword
);

// Reset password route
router.put(
  "/resetpassword/:userId",
  // authValidator.resetPasswordValidator,
  // authValidator.validate,
  authController.resetPassword
);

// Get password reset form route
router.get("/resetpassword/:token", authController.getPasswordResetForm);

router.get("/userscount", authController.getUsersCount);

router.get("/getrestaurants", authController.getRestaurants);

router.put("/updatestatus/:id", authController.updateUserStatus);

router.put("/:id", authController.updateUser)

module.exports = router;
