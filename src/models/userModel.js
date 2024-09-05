const mongoose = require('mongoose');
const crypto = require('crypto');
const {type} = require('os');
require('dotenv');
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
    fcmToken: {
      type: String,
      default: null,
    },

    isCode: {
      type: String,
      default: null,
    },

    expiryCode: {
      type: Date,
      default: null,
    },
  },
  {timestamps: true},
);

userSchema.methods.createResetPasswordToken = () => {
  const resetToken = crypto.randomBytes(32, this.toString('hex'));
  crypto.createHash('sha256').update(resetToken).digest('hex');
};

module.exports = mongoose.model('User', userSchema);
