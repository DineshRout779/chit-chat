const bcrypt = require('bcryptjs');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const generateOTP = require('../utils/generateOTP');

// store OTPs here — { email: { otp, expiresAt } }
const storedOTPs = {};
// emails that completed OTP verification and may now reset password
const verifiedEmails = new Set();
const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Signup handler
 * @param {Object} req - Request object containing username and password
 * @param {Object} res - Response object containing user data or an error message
 * @returns {Object} - Response object with user data or an error message
 */
async function signup(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!email || !username || !password) {
      throw new Error('All fields are required');
    }

    // find user with the given username, if user exists ==> send error
    const user = await User.findOne({ username });
    if (user) {
      return res.status(403).json({
        error: 'User already exists',
      });
    }

    // user does't exists ==> hash password and create new user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // generate jwt token
    const token = jwt.sign(
      {
        _id: newUser._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(201).send({
      message: 'User created successfully',
      token,
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

/**
 * Login handler
 * @param {Object} req - Request object containing username and password
 * @param {Object} res - Response object containing user data or an error message
 * @returns {Object} - Response object with user data or an error message
 */
async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new Error('All fields are required');
    }

    // check if user exists, if not ==> send error
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User does not exists',
      });
    }

    // user exists ==> match password with the encrypted password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // generate jwt token
    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).send({
      message: 'User loggedin successfully',
      token,
    });
  } catch (error) {
    console.log('Error in the login controller: ', error);
    return res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
}

/**
 * Get Loggedin user
 * @param {Object} req - Request object containing username and password
 * @param {Object} res - Response object containing user data or an error message
 * @returns {Object} - Response object with user data or an error message
 */
async function getLoggedInUser(req, res) {
  try {
    return res.status(200).send({
      message: 'User fetched successfully',
      user: req.user,
    });
  } catch (error) {
    console.log('Error in getting loggedin user: ', error);
    return res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
}

/**
 * Handles the forget password functionality by sending a reset OTP to the provided email.
 * @param {Object} req - Request object containing user input, specifically the 'email'.
 * @param {Object} res - Response object to send status and message to the client.
 * @returns {Object} - Response object with status and message indicating the result of the email sending process.
 */
async function forgetPassword(req, res) {
  try {
    const { email } = req.body;

    // check if user exists, if not ==> send error
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email',
      });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });

    storedOTPs[email] = { otp: generateOTP(), expiresAt: Date.now() + OTP_TTL_MS };
    verifiedEmails.delete(email);

    const mailOptions = {
      from: process.env.APP_EMAIL,
      to: email,
      subject: 'Reset password | Chatty 💬',
      text: `Your OTP to reset your password is ${storedOTPs[email].otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(400).json({
          message: 'Failed to send email',
          error: error.message,
          success: false,
        });
      } else {
        console.log('Email sent:', info.response);
        return res.status(200).json({
          success: true,
          message:
            'Email has been sent successfully! Check your inbox or spam folder.',
        });
      }
    });
  } catch (error) {
    console.log('Error in forget password: ', error);
    return res.status(500).json({
      error: error.message,
      message: 'Server error',
    });
  }
}

/**
 * Verify One-Time Password (OTP) before allowing password change
 * @param {*} req - Express request object containing OTP and email
 * @param {*} res - Express response object to send the result of OTP verification
 * @returns {Object} - Response object indicating success or failure of OTP verification
 */
async function verifyOTP(req, res) {
  try {
    const { otp, email } = req.body;

    const record = storedOTPs[email];

    if (!record) {
      return res.status(400).json({ success: false, message: 'No OTP requested for this email' });
    }

    if (Date.now() > record.expiresAt) {
      delete storedOTPs[email];
      return res.status(400).json({ success: false, message: 'OTP has expired' });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    delete storedOTPs[email];
    verifiedEmails.add(email);

    return res.status(200).json({
      success: true,
      message: 'Verified, proceed to change password',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
}

/**
 * Reset user's password after OTP verification
 * @param {*} req - Express request object containing email and new password
 * @param {*} res - Express response object to send the result of password reset
 * @returns {Object} - Response object indicating success or failure of password reset
 */
async function resetPassword(req, res) {
  try {
    const { email, password } = req.body;

    if (!verifiedEmails.has(email)) {
      return res.status(403).json({
        success: false,
        message: 'OTP verification required before resetting password',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    await user.save();

    verifiedEmails.delete(email);

    return res.status(200).json({
      message: 'Password reset successful',
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
}

/**
 * Guest login — logs in the designated guest account without exposing credentials to the client
 */
async function guestLogin(req, res) {
  try {
    const guestUsername = process.env.GUEST_USERNAME;
    const guestPassword = process.env.GUEST_PASSWORD;

    if (!guestUsername || !guestPassword) {
      return res.status(503).json({ success: false, message: 'Guest login is not configured' });
    }

    const user = await User.findOne({ username: guestUsername });
    if (!user) {
      return res.status(503).json({ success: false, message: 'Guest account unavailable' });
    }

    const passwordMatch = await bcrypt.compare(guestPassword, user.password);
    if (!passwordMatch) {
      return res.status(503).json({ success: false, message: 'Guest account misconfigured' });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    return res.status(200).json({ message: 'Logged in as guest', token });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}

module.exports = {
  signup,
  login,
  guestLogin,
  getLoggedInUser,
  forgetPassword,
  verifyOTP,
  resetPassword,
};
