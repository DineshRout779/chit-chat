const User = require('../models/User');

/**
 * Get all users excluding the current user
 * @param req - Express request object
 * @param res - Express response object to send the list of users
 * @returns {Object} - Response object containing the list of users or an error message
 */
async function getAllUsers(req, res) {
  try {
    const users = await User.find(
      { _id: { $ne: req.user._id } },
      '_id username profilePic'
    );

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.log('Error in getting all users: ', error);
    return res.status(500).send({
      message: 'Server Error',
      error: error.message,
    });
  }
}

module.exports = { getAllUsers };
