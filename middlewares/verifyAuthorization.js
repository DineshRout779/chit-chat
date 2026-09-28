const AppError = require('../utils/AppError');

// Ensures the logged-in user (req.user, set by verifyLogin) can only
// act on their own profile (req.profile, set by the userId route param).
const verifyAuthorization = (req, res, next) => {
  const authorized =
    req.profile && req.user && req.profile._id.toString() === req.user._id.toString();

  if (!authorized) {
    throw new AppError('You are not authorized', 403);
  }

  next();
};

module.exports = verifyAuthorization;
