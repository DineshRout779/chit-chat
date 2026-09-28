const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const verifyLogin = require('../middlewares/verifyLogin');
const asyncHandler = require('../middlewares/asyncHandler');
const validate = require('../middlewares/validate');
const { sendMessageSchema } = require('../validators/messageValidators');
const { objectIdParamSchema } = require('../validators/common');

router.post(
  '/',
  verifyLogin,
  validate(sendMessageSchema),
  asyncHandler(messageController.sendMessage),
);

// get messages with a chatId
router.get(
  '/:chatId',
  verifyLogin,
  validate(objectIdParamSchema('chatId'), 'params'),
  asyncHandler(messageController.getAllMessagesByChatId),
);

module.exports = router;
