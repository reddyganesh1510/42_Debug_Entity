const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const User = require("../../models/User");
const { Contract, ipfs } = require("../../config/web3");
const authMiddleware = require("../../middlewares/auth");
const uploadMiddleware = require("../../middlewares/upload");
const MyWalletAddress = "0x6c38De408d6a71b2F672666f203ecDAFC2A00Dea";

router.get("/", [authMiddleware], async (req, res) => {
  const respObj = { msg: "Get User", success: false };
  try {
    const {
      user: { id },
    } = req;
    let user = await User.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ ...respObj, errors: [{ msg: `User not found` }] });
    }

    const { _id, __v, password, ...rest } = user._doc;
    return res.status(200).json({
      ...respObj,
      success: true,
      content: rest,
    });
  } catch (error) {
    res.status(500).json({
      ...respObj,
      errors: [{ msg: "Server error" }],
    });
  }
});

router.post("/upload", [authMiddleware], async (req, res) => {
  const respObj = { msg: "Get User", success: false };
  try {
    const {
      user: { id },
      label,
    } = req;
    let user = await User.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ ...respObj, errors: [{ msg: `User not found` }] });
    }

    uploadMiddleware(req, res, async (err) => {
      if (err) {
        return res
          .status(400)
          .json({ ...respObj, errors: [{ msg: err.message }] });
      }
      const reqFiles = req.files;
      const imageURL = `/documents/docstore/${reqFiles[0]["filename"]}`;
      const data = fs.readFileSync(reqFiles[0]["path"]);
      ipfs
        .add(data)
        .then(async (response) => {
          if (response) {
            const { path, hash, size } = response[0];
            // add to image collection
            const resp = await Contract.methods
              .upload(id, user.documents.length + 1, hash)
              .call({ from: MyWalletAddress });
            res.status(200).json({
              ...respObj,
              content: {
                path,
                hash,
                size,
              },
            });
          } else {
            res.status(400).send("Error processing file");
          }
        })
        .catch((err) => {
          res.status(500).send(err.message);
        });
    });
  } catch (error) {
    res.status(500).json({
      ...respObj,
      errors: [{ msg: "Server error" }],
    });
  }
});

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
    const { email, password, firstName, lastName, mobileNo } = req.body;
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
      firstName,
      lastName,
      mobileNo,
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
