const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyLogin = require('../middlewares/verifyLogin');
const authLimiter = require('../middlewares/rateLimiter');
const asyncHandler = require('../middlewares/asyncHandler');
const validate = require('../middlewares/validate');
const {
  signupSchema,
  loginSchema,
  emailSchema,
  sendOtpSchema,
  verifyOtpSchema,
  resetPasswordSchema,
} = require('../validators/authValidators');

router.use(authLimiter);

router.post('/signup', validate(signupSchema), asyncHandler(authController.signup));
router.post('/login', validate(loginSchema), asyncHandler(authController.login));
router.post('/guest-login', asyncHandler(authController.guestLogin));
router.post(
  '/forget-password',
  validate(emailSchema),
  asyncHandler(authController.forgetPassword),
);
router.post('/verify-otp', validate(verifyOtpSchema), asyncHandler(authController.verifyOTP));
router.post('/send-otp', validate(sendOtpSchema), asyncHandler(authController.sendOtp));
router.post(
  '/reset-password',
  validate(resetPasswordSchema),
  asyncHandler(authController.resetPassword),
);
router.get('/loggedInUser', verifyLogin, asyncHandler(authController.getLoggedInUser));

module.exports = router;
