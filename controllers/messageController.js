const Chat = require('../models/Chat');
const Message = require('../models/Message');
const AppError = require('../utils/AppError');

async function sendMessage(req, res) {
  const { chatId, content } = req.body;

  const chat = await Chat.findById(chatId);
  if (!chat) {
    throw new AppError('Chat not found', 404);
  }

  const isMember = chat.users.some((u) => u.toString() === req.user._id.toString());
  if (!isMember) {
    throw new AppError('Access denied', 403);
  }

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
    '-password',
  );

  return res.status(201).json({ success: true, message: messageWithSender });
}

async function getAllMessagesByChatId(req, res) {
  const chat = await Chat.findById(req.params.chatId);
  if (!chat) {
    throw new AppError('Chat not found', 404);
  }

  const isMember = chat.users.some((u) => u.toString() === req.user._id.toString());
  if (!isMember) {
    throw new AppError('Access denied', 403);
  }

  const messages = await Message.find({ chatId: req.params.chatId }).populate(
    'sender',
    '-password',
  );

  return res.status(200).json({ success: true, messages: messages || [] });
}

module.exports = { sendMessage, getAllMessagesByChatId };
