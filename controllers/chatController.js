const Chat = require('../models/Chat');
const AppError = require('../utils/AppError');

async function createChat(req, res) {
  const { selectedUserId } = req.body;

  // Use $all + $size so order of users array doesn't matter
  const chat = await Chat.findOne({
    users: { $all: [selectedUserId, req.user._id], $size: 2 },
  });

  if (!chat) {
    const newChat = new Chat({
      chatName: '',
      users: [selectedUserId, req.user._id],
    });
    await newChat.save();
    return res.status(200).json({ success: true, chat: newChat });
  }

  return res.status(200).json({ success: true, chat });
}

// get all chats where the loggedin user is a participant
async function getAllChats(req, res) {
  const chats = await Chat.find({ users: req.user._id })
    .sort({ updatedAt: -1 })
    .populate({ path: 'users', select: '-password' })
    .populate({ path: 'latestMessage' });

  return res.status(200).json({
    success: true,
    chats,
  });
}

async function getChatById(req, res) {
  const chat = await Chat.findById(req.params.id);

  if (!chat) {
    throw new AppError('This chat does not exist.', 404);
  }

  const isMember = chat.users.some((u) => u.toString() === req.user._id.toString());
  if (!isMember) {
    throw new AppError('Access denied', 403);
  }

  return res.status(200).json({ success: true, message: 'Chat fetched successfully!', chat });
}

module.exports = { createChat, getAllChats, getChatById };
