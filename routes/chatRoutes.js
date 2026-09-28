const {
  getAllChats,
  createChat,
  getChatById,
} = require('../controllers/chatController');
const verifyLogin = require('../middlewares/verifyLogin');
const asyncHandler = require('../middlewares/asyncHandler');
const validate = require('../middlewares/validate');
const { createChatSchema } = require('../validators/chatValidators');
const { objectIdParamSchema } = require('../validators/common');

const router = require('express').Router();

// create a new chat
router.post('/', verifyLogin, validate(createChatSchema), asyncHandler(createChat));

// get all chats
router.get('/', verifyLogin, asyncHandler(getAllChats));

// get a single  chat by id
router.get(
  '/:id',
  verifyLogin,
  validate(objectIdParamSchema('id'), 'params'),
  asyncHandler(getChatById),
);

module.exports = router;
