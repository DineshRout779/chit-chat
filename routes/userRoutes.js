const {
  getAllUsers,
  getUserById,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const verifyAuthorization = require('../middlewares/verifyAuthorization');
const verifyLogin = require('../middlewares/verifyLogin');

const router = require('express').Router();

router.param('userId', getUserById);

// get all users
router.get('/', verifyLogin, getAllUsers);

// get a single user
router.get('/:userId', verifyLogin, getUser);

// update an user
router.patch('/:userId', verifyLogin, verifyAuthorization, updateUser);

// delete an user
router.delete('/:userId', verifyLogin, verifyAuthorization, deleteUser);

module.exports = router;
