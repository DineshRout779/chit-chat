const mongoose = require('mongoose');

const chatModel = mongoose.Schema(
  {
    chatName: {
      type: String,
      trim: true,
      default: '',
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Chat', chatModel);
