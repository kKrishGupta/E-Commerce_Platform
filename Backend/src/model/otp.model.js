const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      select: false,
    },

    otp: {
      type: String,
      required: true,
      select: false,
    },

    purpose: {
      type: String,
      enum: [
        "register",
        "login",
        "forgot-password",
      ],
      required: true,
    },

    attempts: {
      type: Number,
      default: 0,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: {
        expires: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Otp", otpSchema);