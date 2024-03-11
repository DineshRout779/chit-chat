const { getAllUsers, getUserById } = require('../controllers/userController');
const verifyLogin = require('../middlewares/verifyLogin');

const router = require('express').Router();

// get all users
router.get('/', verifyLogin, getAllUsers);
router.get('/:userId', verifyLogin, getUserById);

module.exports = router;
