const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyLogin = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Remove 'Bearer' from the string to leave just the token
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token missing',
      });
    }

    // Verify that the token is valid by decoding it with JWT
    const user = jwt.verify(token, process.env.JWT_SECRET);

    // verify if user still exists and active
    const userExists = await User.findById(user._id);
    if (!userExists) {
      console.log('User doesnt exists: ', user._id);
      return res.status(401).json({
        success: false,
        message: 'Authentication failed',
      });
    }

    if (!userExists.isActive) {
      console.log('User account is deactivated: ', user._id);
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated.',
      });
    }

    req.user = userExists;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

module.exports = verifyLogin;
