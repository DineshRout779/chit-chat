const Chat = require('../models/Chat');
const Message = require('../models/Message');

async function sendMessage(req, res) {
  try {
    const { chatId, content } = req.body;

    const newMessage = {
      chatId,
      content,
      sender: req.user._id,
    };

    let message = new Message(newMessage);
    await message.save();

    message = await Message.findById(message._id).populate(
      'sender',
      '-password'
    );

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    console.log('Error while sending messages');
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

    if (!messages) {
      throw Error('No Messages Found with the chatId: ', req.params.chatId);
    }

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.log('Error while getting all messages');
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
}

module.exports = { sendMessage, getAllMessagesByChatId };
