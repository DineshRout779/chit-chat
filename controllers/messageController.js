const Message = require('../models/Message');

async function sendMessage(req, res) {
  console.log('body:', req.body);

  const { chatId, content } = req.body;

  const newMessage = {
    chat: chatId,
    content,
    sender: req.user._id,
  };

  const message = new Message(newMessage);

  try {
    await message.save();
    res.status(201).send('Message sent successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
}

// async function getAllMessages(req, res){
//   try {
//     const messages = await Message.find({})
//   } catch (error) {

//   }
// }

module.exports = { sendMessage };
