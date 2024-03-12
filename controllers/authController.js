const bcrypt = require('bcryptjs');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const generateOTP = require('../utils/generateOTP');

// store OTPs here
const storedOTPs = {};

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
      return res.status(401).send('Invalid username or password');
    }

    // user exists ==> match password with the encrypted password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send('Invalid username or password');
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
 * Login handler
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

    // TODO: store OTP for a limited time, then expire or delete it.
    storedOTPs[email] = generateOTP();

    const mailOptions = {
      from: process.env.APP_EMAIL,
      to: email,
      subject: 'Reset password | Chatty 💬',
      text: `Your OTP to reset your password is ${storedOTPs[email]}`,
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

    if (storedOTPs[email] && storedOTPs[email] === otp) {
      return res.status(200).json({
        success: true,
        message: 'Verified, proceed to change password',
      });
    }
    return res.status(400).json({
      sucess: false,
      message: 'Invalid OTP',
    });
  } catch (error) {
    console.log('Error in verify password: ', error);
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
    const user = await User.findOne({ email });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      message: 'Password reset successful',
      success: true,
    });
  } catch (error) {
    console.log('Error in reset password: ', error);
    return res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
}

module.exports = {
  signup,
  login,
  getLoggedInUser,
  forgetPassword,
  verifyOTP,
  resetPassword,
};
