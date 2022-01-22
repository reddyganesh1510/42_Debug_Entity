const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const User = require("../../models/User");
const { Contract, ipfs, web3 } = require("../../config/web3");
const authMiddleware = require("../../middlewares/auth");
const uploadMiddleware = require("../../middlewares/upload");
// const MyWalletAddress = "0x6c38De408d6a71b2F672666f203ecDAFC2A00Dea";
const {
  generateKey,
  encryptData,
  decryptData,
} = require("../../utils/cryptoAes");
const MyWalletAddress = "0x0E365665a0f07b68847e33F7A224E6f3068bF33d";

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
  const respObj = { msg: "Upload User", success: false };
  try {
    const {
      user: { id },
    } = req;
    const { label } = req.body;
    const document = req.body.document;

    let user = await User.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ ...respObj, errors: [{ msg: `User not found` }] });
    }

    const encryptedData = encryptData({
      keyObjStr: user.key,
      dataStr: document,
    });

    const ipfsResponse = await ipfs.add(Buffer.from(encryptedData, "hex"));
    const { path, hash, size } = ipfsResponse[0];
    console.log(ipfsResponse);
    // add to image collection
    const accounts = await web3.eth.getAccounts();

    const contractResponse = await Contract.methods
      .upload(id, user.documents.length + 1, hash)
      .send({ from: accounts[0] });

    const newDocumentObj = {
      label,
      //   liveImage,
      ipfsHash: hash,
      ipfsAddress: `https://gateway.ipfs.io/ipfs/${hash}`,
      transactionHash: contractResponse.transactionHash,
      blockHash: contractResponse.blockHash,
      blockNumber: contractResponse.blockNumber,
      //   imageUrl,
      data: encryptedData,
    };
    user.documents.push(newDocumentObj);
    await user.save();
    res.status(200).json({
      ...respObj,
      content: {
        path,
        hash,
        size,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ...respObj,
      errors: [{ msg: "Server error" }],
    });
  }
});

router.post("/getFile", [authMiddleware], async (req, res) => {
  const { ipfsHash } = req.body;
  const resp = await ipfs.cat(ipfsHash);
  const encryptedData = resp.toString("hex");
  const {
    user: { id },
  } = req;
  let user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ errors: [{ msg: `User not found` }] });
  }
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
    const keyObjStr = generateKey();

    user = new User({
      email: userEmail,
      password: encryptedPassword,
      firstName,
      lastName,
      mobileNo,
      documents: [],
      key: keyObjStr,
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
    console.log(err);
    res.status(500).json({
      ...respObj,
      errors: [{ msg: "Server error" }],
    });
  }
});

module.exports = router;
