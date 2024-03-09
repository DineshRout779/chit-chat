const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: String,
    email: String,
    password: String,
    profilePic: {
      type: String,
      required: true,
      default:
        'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
    },
    status: {
      type: String,
      enum: ['Online', 'Offline'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
