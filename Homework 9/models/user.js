const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    stuId: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true
    }
  },
  { collection: "User", versionKey: false }
);

const user = mongoose.model("User", schema);

module.exports = user;
