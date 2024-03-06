const { getAllUsers } = require('../controllers/userController');
const verifyLogin = require('../middlewares/verifyLogin');

const router = require('express').Router();

// get all users
router.get('/', verifyLogin, getAllUsers);

module.exports = router;
