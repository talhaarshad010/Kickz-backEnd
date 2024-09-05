const mongoose = require('mongoose');

const passwordSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    ref: 'user',
  },
  isToken: {
    type: String,
    default: null,
    required: true,
  },
});

module.exports = mongoose.model('Reset Password', passwordSchema);
