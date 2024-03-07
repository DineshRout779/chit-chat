const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const verifyLogin = require('../middlewares/verifyLogin');

router.post('/', verifyLogin, messageController.sendMessage);

// get messages with a chatId
router.get('/:chatId', verifyLogin, messageController.getAllMessagesByChatId);

module.exports = router;
