const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  mobileNo: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  documents: [
    {
      label: {
        type: String,
      },
      ipfsHash: {
        type: String,
      },
      ipfsAddress: {
        type: String,
      },
      transactionHash: {
        type: String,
      },
      blockHash: {
        type: String,
      },
      blockNumber: {
        type: String,
      },
      imageUrl: {
        type: String,
      },
      liveImage: {
        type: String,
      },
      data: {
        type: String,
      },
    },
  ],
});

const User = mongoose.model("user", UserSchema);
module.exports = User;
