const Chat = require('../models/Chat');
const Message = require('../models/Message');

async function sendMessage(req, res) {
  try {
    const { chatId, content } = req.body;

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }

    if (content.length > 2000) {
      return res.status(400).json({ success: false, message: 'Message exceeds 2000 characters' });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }

    const isMember = chat.users.some((u) => u.toString() === req.user._id.toString());
    if (!isMember) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const newMessage = new Message({
      chatId,
      content: content.trim(),
      sender: req.user._id,
      isReadBy: [req.user._id],
    });

    const savedMessage = await newMessage.save();

    await Chat.findByIdAndUpdate(chatId, { latestMessage: savedMessage });

    const messageWithSender = await Message.findById(savedMessage._id).populate(
      'sender',
      '-password'
    );

    res.status(201).json({ success: true, message: messageWithSender });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

async function getAllMessagesByChatId(req, res) {
  try {
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }

    const isMember = chat.users.some((u) => u.toString() === req.user._id.toString());
    if (!isMember) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const messages = await Message.find({ chatId: req.params.chatId }).populate(
      'sender',
      '-password'
    );

    return res.status(200).json({ success: true, messages: messages || [] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

module.exports = { sendMessage, getAllMessagesByChatId };
