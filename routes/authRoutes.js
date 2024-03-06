const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyLogin = require('../middlewares/verifyLogin');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forget-password', authController.forgetPassword);
router.post('/verify-otp', authController.verifyOTP);
router.post('/reset-password', authController.resetPassword);
router.get('/loggedInUser', verifyLogin, authController.getLoggedInUser);

module.exports = router;
