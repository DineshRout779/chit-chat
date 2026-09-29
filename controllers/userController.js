const User = require('../models/User');
const AppError = require('../utils/AppError');

/**
 * Get all users excluding the current user
 * @param req - Express request object that may or may not contain a query parameter 'username'
 * @param res - Express response object to send the list of users except the loggedin user
 */
async function getAllUsers(req, res) {
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
}

/**
 * Get user by id
 * @param req - Express request object containing userId as params
 * @param res - Express response object to send the user
 */
async function getUserById(req, res, next, userId) {
  const user = await User.findById(userId).select('-password');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  req.profile = user;
  next();
}

async function getUser(req, res) {
  return res.status(200).json({
    success: true,
    user: req.profile,
  });
}

/**
 * Update user details
 * @param req - Express request object containing userId as params and updated user data in the body
 * @param res - Express response object to send the updated user or an error message
 */
async function updateUser(req, res) {
  const { username, profilePic } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    req.params.userId,
    { username, profilePic },
    { new: true, select: '-password' },
  );

  if (!updatedUser) {
    throw new AppError('User not found', 404);
  }

  return res.status(200).json({
    success: true,
    user: updatedUser,
  });
}

/**
 * Delete user
 * @param req - Express request object containing userId as params
 * @param res - Express response object to send a success message or an error message
 */
async function deleteUser(req, res) {
  const deletedUser = await User.findByIdAndDelete(req.params.userId);

  if (!deletedUser) {
    throw new AppError('User not found', 404);
  }

  return res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  });
}

module.exports = {
  getAllUsers,
  getUserById,
  getUser,
  updateUser,
  deleteUser,
};
