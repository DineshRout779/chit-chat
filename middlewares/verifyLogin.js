const jwt = require('jsonwebtoken');

const verifyLogin = async (req, res, next) => {
  try {
    const authHeader = await req.headers['authorization'];
    if (!authHeader) throw new Error('No authorization header provided');

    // Remove 'Bearer' from the string to leave just the token
    let token = authHeader.split(' ')[1];

    if (!token) throw new Error('No token provided');

    // Verify that the token is valid by decoding it with JWT
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
    });
  }
};

module.exports = verifyLogin;
