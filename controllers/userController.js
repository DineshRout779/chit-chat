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

async function searchUser(req, res) {
  try {
    const { username } = req.query;
    const users = await User.find({ username });

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.log('Error in searching users: ', error);
    return res.status(500).send({
      message: 'Server Error',
      error: error.message,
    });
  }
}

async function getUserById(req, res) {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.password = undefined;

    return res.status(200).json({
      success: true,
      message: 'User fetched successfully!',
      user,
    });
  } catch (error) {
    console.log('Error while fetching user: ', error);
    return res.status(500).json({
      error: error.message,
      message: 'Server error',
    });
  }
}

module.exports = { getAllUsers, searchUser, getUserById };
