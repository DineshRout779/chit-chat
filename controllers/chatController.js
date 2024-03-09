const Chat = require('../models/Chat');

async function createChat(req, res) {
  try {
    const { selectedUserId } = req.body;

    const users = [selectedUserId, req.user._id];

    console.log('sender id:', req.user._id);
    console.log('receiver id:', selectedUserId);

    // find chat with the users provided, IF found ===> send chat ELSE create a new chat
    const chat = await Chat.findOne({
      users,
    });

    console.log('chat: ', chat);

    if (!chat) {
      const newChat = new Chat({
        chatName: '',
        users,
      });
      await newChat.save();
      return res.status(200).json({
        success: true,
        chat: newChat,
      });
    }

    return res.status(200).json({
      success: true,
      chat,
    });
  } catch (error) {
    console.log('error while creating the chat');

    return res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
}

// get all chats where the loggedin user is a participant
async function getAllChats(req, res) {
  try {
    const chats = await Chat.find({ users: req.user._id })
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

module.exports = { createChat, getAllChats };
