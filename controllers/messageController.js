const Chat = require('../models/Chat');
const Message = require('../models/Message');

async function sendMessage(req, res) {
  try {
    const { chatId, content } = req.body;

    const newMessage = new Message({
      chatId,
      content,
      sender: req.user._id,
      isReadBy: [req.user._id],
    });

    const savedMessage = await newMessage.save();

    await Chat.findByIdAndUpdate(chatId, { latestMessage: savedMessage });

    const messageWithSender = await Message.findById(savedMessage._id).populate(
      'sender',
      '-password'
    );

    res.status(201).json({
      success: true,
      message: messageWithSender,
    });
  } catch (error) {
    console.error('Error while sending message:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
}

async function getAllMessagesByChatId(req, res) {
  try {
    const messages = await Message.find({ chatId: req.params.chatId }).populate(
      'sender',
      '-password'
    );

    // Return empty array if no messages are found
    return res.status(200).json({
      success: true,
      messages: messages || [],
    });
  } catch (error) {
    console.error('Error while getting all messages:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
}

module.exports = { sendMessage, getAllMessagesByChatId };
