// middleware/authenticateToken.js
const jwt = require('jsonwebtoken');

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  // Get the token from the authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ msg: 'Access denied, no token provided' });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ msg: 'Invalid or expired token' });
    }
    
    // Ensure that userId is available
    if (!user.userId) {
      return res.status(403).json({ msg: 'Token does not contain user ID' });
    }

    // Attach user info to the request object for use in the next middleware or route
    req.user = { userId: user.userId }; // Only store userId to limit exposure of other user info
    next(); // Proceed to the next middleware or route
  });
};

module.exports = authenticateToken;
