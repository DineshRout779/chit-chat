const bcrypt = require('bcryptjs');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const { default: generateOTP } = require('../utils/generateOtp');

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

    // find user with the given username, if user exists ==> send error
    const user = await User.find({ username });
    if (user) {
      return res.status(403).json({
        error: 'User already exists',
      });
    }

    // user does't exists ==> hash password and create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // TODO: Use jwt token
    newUser.password = undefined;
    return res.status(201).send({
      message: 'User created successfully',
      user: newUser,
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

    // TODO: use jwt token
    user.password = undefined;
    req.user = user;

    return res.status(200).send({
      user,
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

    const mailOptions = {
      from: process.env.APP_EMAIL,
      to: email,
      subject: 'Reset password | Chatty 💬',
      text: `Your OTP to reset your password is ${generateOTP()}`,
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

async function verifyPassword(req, res) {
  try {
  } catch (error) {}
}

module.exports = { signup, login, forgetPassword };
