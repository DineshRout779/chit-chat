const {
  getAllChats,
  createChat,
  getChatById,
} = require('../controllers/chatController');
const verifyLogin = require('../middlewares/verifyLogin');

const router = require('express').Router();

// create a new chat
router.post('/', verifyLogin, createChat);

// get all chats
router.get('/', verifyLogin, getAllChats);

// get a single  chat by id
router.get('/:id', verifyLogin, getChatById);

module.exports = router;
