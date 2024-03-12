const verifyAuthorization = async (req, res, next) => {
  try {
    const authorized =
      req.profile && req.user && req.profile._id == req.user._id;
    if (!authorized) {
      return res.status(403).json({
        error: 'You are not authorized',
      });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = verifyAuthorization;
