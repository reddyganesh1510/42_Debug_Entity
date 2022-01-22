const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../../models/Admin");

// @route   -  POST /xcb/api/auth/admin
// @desc    -  Login Admin
// @access  -  Public

router.post("/login", async (req, res) => {
  const respObj = { msg: "Login Admin", success: false };
  //Validating request body
  try {
    //Extract & Prepare Information
    const { email, password } = req.body;
    let adminEmail = email.toString().trim();

    //Check if admin exists
    let admin = await Admin.findOne({ email: adminEmail });
    if (!admin) {
      return res
        .status(404)
        .json({ ...respObj, errors: [{ msg: `Email/password is invalid` }] });
    }

    //Validate password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ ...respObj, errors: [{ msg: `Email/password is invalid` }] });
    }

    //Create JWT Token
    const payload = { admin: { email: admin.email, id: admin._id } };
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
  const respObj = { msg: "Register Admin", success: false };
  //Validating request body
  try {
    //Extract & Prepare Information
    const { email, password } = req.body;
    let adminEmail = email.toString().trim();

    //Check if admin exists
    let admin = await Admin.findOne({ email: adminEmail });
    if (admin) {
      return res.status(404).json({
        ...respObj,
        errors: [{ msg: `Email already exists. Please try to login` }],
      });
    }

    const salt = await bcrypt.genSalt(10);
    let encryptedPassword = await bcrypt.hash(password, salt);

    admin = new Admin({
      email: adminEmail,
      password: encryptedPassword,
      documents: [],
    });
    await admin.save();

    const payload = { admin: { email: admin.email, id: admin._id } };
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
