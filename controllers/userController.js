const User = require('../models/User');

/**
 * Get all users excluding the current user
 * @param req - Express request object that may or may not contain a query parameter 'username'
 * @param res - Express response object to send the list of users except the loggedin user
 * @returns {Object} - Response object containing the list of users or an error message
 */
async function getAllUsers(req, res) {
  try {
    const users = req.query.username
      ? await User.find({
          _id: { $ne: req.user._id },
          username: new RegExp(req.query.username, 'i'),
        }).select('-password')
      : await User.find({ _id: { $ne: req.user._id } }).select('-password');

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

/**
 * Get user by id
 * @param req - Express request object containing userId as params
 * @param res - Express response object to send the user
 * @returns {Object} - Response object containing the list of users or an error message
 */
async function getUserById(req, res, next, userId) {
  try {
    const user = await User.findById(userId).select('-password');

    // if user not found ==> send error response
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    req.profile = user;
    next();
  } catch (error) {
    console.log('Error while fetching user: ', error);
    return res.status(500).json({
      error: error.message,
      message: 'Server error',
    });
  }
}

async function getUser(req, res) {
  try {
    return res.status(200).json({
      success: false,
      user: req.profile,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
}

/**
 * Update user details
 * @param req - Express request object containing userId as params and updated user data in the body
 * @param res - Express response object to send the updated user or an error message
 * @returns {Object} - Response object containing the updated user or an error message
 */
async function updateUser(req, res) {
  try {
    const { username, profilePic } = req.body;

    // Update user details
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { username, profilePic },
      { new: true, select: '-password' }
    );

    // if user not found ==> send error response
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.log('Error while updating user: ', error);
    return res.status(500).json({
      error: error.message,
      message: 'Server error',
    });
  }
}

/**
 * Delete user
 * @param req - Express request object containing userId as params
 * @param res - Express response object to send a success message or an error message
 * @returns {Object} - Response object containing a success message or an error message
 */
async function deleteUser(req, res) {
  try {
    // Delete user
    const deletedUser = await User.findByIdAndDelete(req.params.userId);

    // if user not found ==> send error response
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.log('Error while deleting user: ', error);
    return res.status(500).json({
      error: error.message,
      message: 'Server error',
    });
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  getUser,
  updateUser,
  deleteUser,
};
