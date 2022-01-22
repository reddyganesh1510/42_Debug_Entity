const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/User");

// @route   -  POST /xcb/api/auth/user
// @desc    -  Login User
// @access  -  Public

router.post("/login", async (req, res) => {
  const respObj = { msg: "Login User", success: false };
  //Validating request body
  try {
    //Extract & Prepare Information
    const { email, password } = req.body;
    let userEmail = email.toString().trim();

    //Check if user exists
    let user = await User.findOne({ email: userEmail });
    if (!user) {
      return res
        .status(404)
        .json({ ...respObj, errors: [{ msg: `Email/password is invalid` }] });
    }

    //Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ ...respObj, errors: [{ msg: `Email/password is invalid` }] });
    }

    //Create JWT Token
    const payload = { user: { email: user.email, id: user._id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY_DAYS },
      (err, token) => {
        if (err) {
          throw new Error("Error creating auth token");
        }
        return res.status(201).json({
          ...respObj,
          success: true,
          content: { token },
        });
      }
    );
  } catch (err) {
    res.status(500).json({
      ...respObj,
      errors: [{ msg: "Server error" }],
    });
  }
});
router.post("/register", async (req, res) => {
  const respObj = { msg: "Register User", success: false };
  //Validating request body
  try {
    //Extract & Prepare Information
    const { email, password } = req.body;
    let userEmail = email.toString().trim();

    //Check if user exists
    let user = await User.findOne({ email: userEmail });
    if (user) {
      return res.status(404).json({
        ...respObj,
        errors: [{ msg: `Email already exists. Please try to login` }],
      });
    }

    const salt = await bcrypt.genSalt(10);
    let encryptedPassword = await bcrypt.hash(password, salt);

    user = new User({
      email: userEmail,
      password: encryptedPassword,
      documents: [],
    });
    await user.save();

    const payload = { user: { email: user.email, id: user._id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY_DAYS },
      (err, token) => {
        if (err) {
          throw new Error("Error creating auth token");
        }
        return res.status(201).json({
          ...respObj,
          success: true,
          content: { token },
        });
      }
    );
  } catch (err) {
    res.status(500).json({
      ...respObj,
      errors: [{ msg: "Server error" }],
    });
  }
});

module.exports = router;
