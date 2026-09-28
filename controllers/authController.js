const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Otp = require('../models/Otp');
const sendEmail = require('../utils/email');
const { generateOTP, hashOTP } = require('../utils/otp');
const AppError = require('../utils/AppError');

const OTP_EXPIRY_MINUTES = 10;
const MAX_ATTEMPTS = 5;

/**
 * Signup handler
 * @param {Object} req - Request object containing username, email and password (validated upstream)
 * @param {Object} res - Response object containing user data or an error message
 */
async function signup(req, res) {
  const { username, email, password } = req.body;

  // find user with the given username or email, if either exists ==> send error
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    throw new AppError('User already exists', 409);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  await newUser.save();

  const otp = generateOTP();
  const otpHash = hashOTP(otp);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await Otp.create({
    user: newUser._id,
    otpHash,
    purpose: 'EMAIL_VERIFICATION',
    expiresAt,
  });

  try {
    await sendEmail(email, otp, 'EMAIL_VERIFICATION');
  } catch (error) {
    console.error('Error sending verification email:', error);
  }

  return res.status(201).json({
    success: true,
    message:
      'User created successfully. Please verify your email using the OTP sent to you.',
  });
}

/**
 * Login handler
 * @param {Object} req - Request object containing username and password (validated upstream)
 * @param {Object} res - Response object containing user data or an error message
 */
async function login(req, res) {
  const { username, password } = req.body;

  // Same generic message whether the account doesn't exist or the password is
  // wrong — avoids leaking which usernames are registered.
  const user = await User.findOne({ username });
  const passwordMatch = user
    ? await bcrypt.compare(password, user.password)
    : false;

  if (!user || !passwordMatch) {
    throw new AppError('Invalid credentials', 401);
  }

  if (!user.isVerified) {
    return res.status(403).json({
      success: false,
      code: 'EMAIL_NOT_VERIFIED',
      email: user.email,
      message: 'Please verify your email before logging in',
    });
  }

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  return res.status(200).json({
    success: true,
    message: 'User loggedin successfully',
    token,
  });
}

/**
 * Get logged-in user
 * @param {Object} req - Request object (req.user set by verifyLogin)
 * @param {Object} res - Response object containing the user's own profile
 */
async function getLoggedInUser(req, res) {
  return res.status(200).json({
    success: true,
    message: 'User fetched successfully',
    user: req.user,
  });
}

/**
 * Handles the forget password functionality by sending a reset OTP to the provided email.
 * @param {Object} req - Request object containing 'email' (validated upstream)
 * @param {Object} res - Response object to send status and message to the client.
 */
async function forgetPassword(req, res) {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    // Generic message — don't confirm whether the email is registered.
    return res.status(200).json({
      success: true,
      message: 'If that email is registered, an OTP has been sent to it.',
    });
  }

  // invalidate any OTP already outstanding for this user/purpose so only
  // the one just emailed can ever verify successfully
  await Otp.deleteMany({
    user: user._id,
    purpose: 'PASSWORD_RESET',
    verifiedAt: null,
  });

  const otp = generateOTP();
  const otpHash = hashOTP(otp);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await Otp.create({
    user: user._id,
    otpHash,
    purpose: 'PASSWORD_RESET',
    expiresAt,
  });

  try {
    await sendEmail(email, otp, 'PASSWORD_RESET');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new AppError('Failed to send email', 502);
  }

  return res.status(200).json({
    success: true,
    message: 'If that email is registered, an OTP has been sent to it.',
  });
}

/**
 * Verify a One-Time Password for either email verification or password reset
 * @param {*} req - Request object containing otp, email and purpose (validated upstream)
 * @param {*} res - Response object indicating success or failure of OTP verification
 */
async function verifyOTP(req, res) {
  const { otp, email, purpose = 'PASSWORD_RESET' } = req.body;

  // Same generic message across "unknown email", "no OTP outstanding",
  // "expired" and "wrong code" — avoids confirming which emails are registered.
  const user = await User.findOne({ email });
  const record = user
    ? await Otp.findOne({ user: user._id, purpose, verifiedAt: null }).sort({
        createdAt: -1,
      })
    : null;

  if (!record) {
    throw new AppError('Invalid or expired OTP', 400);
  }

  if (Date.now() > record.expiresAt.getTime()) {
    throw new AppError('Invalid or expired OTP', 400);
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    throw new AppError('Too many attempts, request a new OTP', 429);
  }

  if (record.otpHash !== hashOTP(otp)) {
    record.attempts += 1;
    await record.save();
    throw new AppError('Invalid or expired OTP', 400);
  }

  record.verifiedAt = new Date();
  await record.save();

  if (purpose === 'EMAIL_VERIFICATION') {
    user.isVerified = true;
    await user.save();
    await Otp.deleteOne({ _id: record._id });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      token,
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Verified, proceed to change password',
  });
}

/**
 * Reset user's password after OTP verification
 * @param {*} req - Request object containing email and new password (validated upstream)
 * @param {*} res - Response object indicating success or failure of password reset
 */
async function resetPassword(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('OTP verification required before resetting password', 403);
  }

  const verifiedOTP = await Otp.findOne({
    user: user._id,
    purpose: 'PASSWORD_RESET',
    verifiedAt: { $ne: null },
  }).sort({ verifiedAt: -1 });

  if (!verifiedOTP || Date.now() > verifiedOTP.expiresAt.getTime()) {
    throw new AppError('OTP verification required before resetting password', 403);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  user.password = hashedPassword;
  await user.save();

  await Otp.deleteOne({ _id: verifiedOTP._id });

  return res.status(200).json({
    success: true,
    message: 'Password reset successful',
  });
}

/**
 * Guest login — logs in the designated guest account without exposing credentials to the client
 */
async function guestLogin(req, res) {
  const guestUsername = process.env.GUEST_USERNAME;
  const guestPassword = process.env.GUEST_PASSWORD;

  if (!guestUsername || !guestPassword) {
    throw new AppError('Guest login is not configured', 503);
  }

  const user = await User.findOne({ username: guestUsername });
  const passwordMatch = user
    ? await bcrypt.compare(guestPassword, user.password)
    : false;

  if (!user || !passwordMatch) {
    throw new AppError('Guest login is currently unavailable', 503);
  }

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  return res.status(200).json({ success: true, message: 'Logged in as guest', token });
}

/**
 * Send/resend an OTP for email verification or password reset (used by the
 * post-login "verify your email" screen).
 */
async function sendOtp(req, res) {
  const { email, purpose } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    // Generic response — don't confirm whether the email is registered.
    return res.status(200).json({
      success: true,
      message: 'If that email is registered, an OTP has been sent to it.',
    });
  }

  // invalidate any OTP already outstanding for this user/purpose so only
  // the one just emailed can ever verify successfully
  await Otp.deleteMany({ user: user._id, purpose, verifiedAt: null });

  const otp = generateOTP();
  const otpHash = hashOTP(otp);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await Otp.create({
    user: user._id,
    otpHash,
    purpose,
    expiresAt,
  });

  try {
    await sendEmail(email, otp, purpose);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new AppError('Failed to send verification email', 502);
  }

  return res.status(200).json({
    success: true,
    message: 'If that email is registered, an OTP has been sent to it.',
  });
}

module.exports = {
  signup,
  login,
  guestLogin,
  getLoggedInUser,
  forgetPassword,
  verifyOTP,
  resetPassword,
  sendOtp,
};
