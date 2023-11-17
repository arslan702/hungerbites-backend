require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require('cloudinary');

// required models
const User = require("../models/userAuth.model");
const ShoppingCart = require("../models/shoppingCart.model");

const saltRounds = 10;

const { sendResetPasswordEmail } = require("../utils/email");
// const NicImage = require("../models/nicImage.model");
// const { uploadImage } = require("../middlewares/uploadImage");

// Register a new user
exports.register = async (req, res) => {
  const {
    email,
    password,
    name,
    contactNumber,
  } = req.body;
  console.log('here  ',req.body);
  
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("User already exists with this email.");
    }

    const newUser = await User.create({
      email,
      password,
      name,
      contactNumber
    });

    const salt = bcrypt.genSaltSync(10);
    newUser.password = bcrypt.hashSync(password, salt);
    const userAuth = await newUser.save();

    const cart = await ShoppingCart.create({
      auth_user_id: userAuth?.id,
    });

    const token = jwt.sign(
      {
        id: userAuth?.id,
        email: userAuth?.email,
        name: userAuth?.name,
        contactNumber: userAuth?.contactNumber
      },
      process.env.JWT_SECRET
    );

    res.status(201).json({
      message: "User created successfully.",
      user: {
        id: userAuth.id,
        email: userAuth.email,
        name: userAuth.name,
        role: userAuth.role,
        contactNumber: userAuth.contactNumber
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.registerRestaurant = async (req, res) => {
  const {
    email,
    password,
    name,
    contactNumber,
    address,
    latitude,
    longitude,
    status,
    role,
    image
  } = req.body;
  console.log('here  ',req.body);
  
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("User already exists with this email.");
    }
    const result = await cloudinary.v2.uploader.upload(image, { folder: 'menu-items' });

    // Get the uploaded image URL from the Cloudinary response
    const image_url = result.secure_url;

    const newUser = await User.create({
      email,
      password,
      name,
      contactNumber,
      address,
      latitude,
      longitude,
      status,
      role,
      image_url
    });

    const salt = bcrypt.genSaltSync(10);
    newUser.password = bcrypt.hashSync(password, salt);
    const userAuth = await newUser.save();

    const cart = await ShoppingCart.create({
      auth_user_id: userAuth?.id,
    });

    const token = jwt.sign(
      {
        id: userAuth?.id,
        email: userAuth?.email,
        name: userAuth?.name,
        contactNumber: userAuth?.contactNumber,
        address: userAuth?.address,
        latitude: userAuth?.latitude,
        longitude: userAuth?.longitude,
        status: userAuth?.status,
        role: userAuth?.role,
      },
      process.env.JWT_SECRET
    );

    res.status(201).json({
      message: "User created successfully.",
      user: {
        id: userAuth.id,
        email: userAuth.email,
        name: userAuth.name,
        role: userAuth.role,
        contactNumber: userAuth.contactNumber,
        address: userAuth?.address,
        latitude: userAuth?.latitude,
        longitude: userAuth?.longitude,
        status: userAuth?.status,
        role: userAuth?.role,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Login an existing user
exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({
    where: { email },
  })
    .then((user) => {
      console.log("user", user);

      // If user not found, return error message
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials." });
      }

      // Check if password is correct
      return bcrypt.compare(password, user.password).then((passwordMatches) => {
        console.log(user.password, password, passwordMatches);

        if (!passwordMatches) {
          return res.status(401).json({ error: "Invalid credentials." });
        }

        // Generate JWT token and return success message
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

        return Promise.all([user]).then(
          ([user]) => {
            return res.status(200).json({
              message: "Logged in successfully.",
              user: {
                id: user.id,
                email: user.email,
                name: user?.name,
                status: user?.status,
                address: user?.address,
                longitude: user?.longitude,
                latitude: user?.latitude,
                role: user?.role,
              },
              token,
            });
          }
        );
      });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({ error: "Internal server error." });
    });
};

// update user 
exports.updateUser = async (req, res) => {
  try {
    const userIdToUpdate = req.params.id; // Provide the user's ID you want to update
    const updatedData = {
      ...req.body,
      address: req.body.address,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      // ... other properties you want to update
    };
  
    const updatedUser = await User.update(
      req.body, { where: { id: userIdToUpdate}}
    );
    return res.status(200).json({ message: "User Status updated", updatedUser });
  } catch (error) {
    console.error("Error updating user:", error.message);
  }
}

// get users count 
exports.getUsersCount = async (req, res) => {
  try {
    const all = await User.findAndCountAll();
    const allUsers = all.count;
    const active = await User.findAndCountAll({
      where: { status: 'active'}
    })
    const activeUsers = active.count;
    const inactive = await User.findAndCountAll({
      where: { status: 'inactive'}
    })
    const inactiveUsers = inactive.count;
    console.log({all})
    res.status(200).json({all, active, inactive})
  } catch (error) {
    res.status(500).json(error.message);
  }
}

// get restaurants
exports.getRestaurants = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        role: 'restaurant'
      }
    });

    res.status(200).json({users})
  } catch (error) {
    console.error(error);
    res.status(500).json({error})
  }
}
// Forgot password - send reset password email to user
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  User.findOne({ where: { email } })
    .then((user) => {
      if (!user) {
        return res
          .status(400)
          .json({ error: "User with this email not found." });
      }

      const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      user.resetToken = resetToken;
      return user.save();
    })
    .then(() => {
      const resetLink = `${process.env.BASE_URL}/resetpassword/${resetToken}`;
      return sendResetPasswordEmail(email, resetLink);
    })
    .then(() => {
      return res
        .status(200)
        .json({ message: "Reset password email sent successfully." });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({ error: "Internal server error." });
    });
};

// Reset password - with token
exports.resetPassword = async (req, res) => {
  const { password } = req.body;
  console.log({password})

  try {
    // Find user from authenticated token
    User.findOne({ where: { id: req.params.userId } })
      .then(async (user) => {
        // Update user password with new password
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        user.password = hashedPassword;
        // user.resetToken = null;
        await user.save();

        // Return success message
        return res
          .status(200)
          .json({ message: "Password reset successfully." });
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).json({ error: "Internal server error." });
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// Reset password - without token
exports.resetPasswordWithoutToken = async (req, res) => {
  const { email, token, password } = req.body;

  try {
    // Find user with given email and token
    const user = await User.findOne({
      where: { email, resetToken: token },
    });

    // If user not found, return error message
    if (!user) {
      return res.status(400).json({ error: "Invalid reset token." });
    }

    // Check if token has expired
    const tokenExpired = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });

    // If token has expired, return error message
    if (tokenExpired) {
      return res.status(400).json({ error: "Reset token has expired." });
    }

    // Update user password with new password
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    user.password = hashedPassword;
    user.resetToken = null;
    await user.save();

    // Return success message
    return res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

exports.getPasswordResetForm = async (req, res) => {
  try {
    // Get the token from the URL params
    const token = req.params.token;

    // Find the user with the matching reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      // If the token is invalid or has expired, redirect to the forgot password form
      req.flash("error", "Password reset token is invalid or has expired.");
      return res.redirect("/forgotpassword");
    }

    // Render the password reset form with the token as a hidden input field
    res.render("resetpassword", { token });
  } catch (error) {
    console.error(error);
    req.flash("error", "Error getting password reset form.");
    res.redirect("/forgotpassword");
  }
};

exports.updateUserStatus = (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  console.log(id, '   ', status)
  const user = User.findByPk(id);

  if (!user) {
    res.status(400).json({ message: "User not found" });
  }

  try {
    const authUser = User.update(
      {
        status,
      },
      {
        where: { id },
      }
    );
    return res.status(200).json({ message: "User Status updated", authUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating user status." });
  }
};
