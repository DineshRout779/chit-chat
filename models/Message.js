const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      trim: true,
    },
    sender: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Message', messageSchema);
