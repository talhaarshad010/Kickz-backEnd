const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    userPassword: {
      type: String,
      required: true,
    },
    isType: {
      type: String,
      default: 'Instructor',
    },

    isBlock: {
      type: Boolean,
      default: false,
    },

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

module.exports = mongoose.model('Instructor', instructorSchema);
