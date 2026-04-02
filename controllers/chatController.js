const Chat = require('../models/Chat');

async function createChat(req, res) {
  try {
    const { selectedUserId } = req.body;

    if (!selectedUserId) {
      return res.status(400).json({ success: false, message: 'selectedUserId is required' });
    }

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
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// get all chats where the loggedin user is a participant
async function getAllChats(req, res) {
  try {
    const chats = await Chat.find({ users: req.user._id })
      .sort({
        updatedAt: -1,
      })
      .populate({
        path: 'users',
        select: '-password',
      })
      .populate({
        path: 'latestMessage',
      });

    return res.status(200).json({
      success: true,
      chats,
    });
  } catch (error) {
    console.log('Error while getting all chats: ', error);
    return res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
}

async function getChatById(req, res) {
  try {
    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({ success: false, message: 'This chat does not exist.' });
    }

    const isMember = chat.users.some((u) => u.toString() === req.user._id.toString());
    if (!isMember) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    return res.status(200).json({ success: true, message: 'Chat fetched successfully!', chat });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}

module.exports = { createChat, getAllChats, getChatById };
