const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },

    userPassword: {
      type: String,
      required: true,
    },

    isToken: {
      type: String,
      default: null,
    },
    resetPasswordVerificationCode: {
      type: String,
      default: null,
    },
    otp: {
      type: String,
      default: null,
    },
    expiryCode: {
      type: Date,
      default: null,
    },
    resetcodeExpiry: {
      type: Date,
      default: null,
    },
  },
  {timestamps: true},
);
module.exports = mongoose.model('User', userSchema);
