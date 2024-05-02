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

    // phoneNumber: {
    //   type: String,
    //   required: true,
    // },

    userPassword: {
      type: String,
      required: true,
    },
    // isType: {
    //   type: String,
    //   default: 'User',
    // },

    // isBlock: {
    //   type: Boolean,
    //   default: false,
    // },

    isToken: {
      type: String,
      default: null,
    },
    fcmToken: {
      type: String,
      default: null,
    },
  },
  {timestamps: true},
);

module.exports = mongoose.model('User', userSchema);
