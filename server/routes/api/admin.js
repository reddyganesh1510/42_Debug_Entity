const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../../models/Admin");
const User = require("../../models/User");
const adminMiddleWare = require("../../middlewares/admin");
const { Contract, ipfs, web3 } = require("../../config/web3");

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

router.post("/verify", [adminMiddleWare], async (req, res) => {
  const respObj = { msg: "Verify User By Admin", success: false };
  try {
    const { userId, documentId, isValid } = req.body;
    let user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ ...respObj, errors: [{ msg: `User not found` }] });
    }
    const accounts = await web3.eth.getAccounts();
    const documentIndex = user.documents.findIndex(
      (item) => item._id === documentId
    );
    const contractResponse = await Contract.methods
      .validate(id, documentIndex + 1, isValid)
      .send({ from: accounts[0] });
    user.documents[documentIndex].isValid = isValid;
    await user.save();
    return res.status(201).json({
      ...respObj,
      success: true,
      content: { msg: "Document Updated Successfully" },
    });
  } catch (error) {
    res.status(500).json({
      ...respObj,
      errors: [{ msg: "Server error" }],
    });
  }
});

router.get("/getAllUnverified", [adminMiddleWare], async (req, res) => {
  const respObj = { msg: "Get All Un Verified Users By Admin", success: false };
  try {
    const users = await User.find({});
    let docs = [];
    for (let user of users) {
      const { firstName, lastName, email } = user;
      for (let doc of user.documents) {
        if (!doc.isValid) {
          docs.push({
            email,
            firstName,
            lastName,
            doc,
          });
        }
      }
    }
    return res.status(201).json({
      ...respObj,
      success: true,
      content: { docs },
    });
  } catch (error) {
    res.status(500).json({
      ...respObj,
      errors: [{ msg: "Server error" }],
    });
  }
});

router.post("/getFile", [adminMiddleWare], async (req, res) => {
  const { ipfsHash, userId } = req.body;
  let user = await User.findById(userId);

  if (!user) {
    return res
      .status(404)
      .json({ ...respObj, errors: [{ msg: `User not found` }] });
  }
  const resp = await ipfs.cat(ipfsHash);
  const encryptedData = resp.toString("hex");
  const decryptedData = decryptData({
    keyObjStr: user.key,
    encryptedStr: encryptedData,
  });
  res.status(200).json({
    content: {
      decryptedData,
    },
  });
});

module.exports = router;
