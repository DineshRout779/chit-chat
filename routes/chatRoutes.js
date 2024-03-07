const { getAllChats, createChat } = require('../controllers/chatController');
const verifyLogin = require('../middlewares/verifyLogin');

const router = require('express').Router();

// create a new chat
router.post('/', verifyLogin, createChat);

// get all chats
router.get('/', verifyLogin, getAllChats);

module.exports = router;
