const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Not authorized, login again' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, login again' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof decoded !== 'object' || !decoded.userID) {
      throw new Error('Invalid token payload');
    }

    req.body.userId = decoded.userID;

    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

module.exports = { authMiddleware };
