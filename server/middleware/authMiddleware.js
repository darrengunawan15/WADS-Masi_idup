const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes
const protect = async (req, res, next) => {
  console.log('Protect middleware executed'); // Log at the very beginning
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    console.log('Authorization header found'); // Log if header exists
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      console.log('Token extracted:', token ? '[PRESENT]' : '[MISSING]'); // Log token presence

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token verified, decoded ID:', decoded.id); // Log decoded ID

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');
      console.log('User found by token ID:', req.user ? req.user.email : 'None'); // Log user found

      if (!req.user) {
        console.log('User not found after token verification'); // Log if user not found
        res.status(401).json({ message: 'Not authorized, user not found' });
        return;
      }

      console.log('Protect middleware complete, calling next()'); // Log before calling next
      next();
    } catch (error) {
      console.error('Error in protect middleware:', error); // More specific error log
      res.status(401).json({ message: 'Not authorized, token failed' });
      return;
    }
  }

  if (!token) {
    console.log('No token in authorization header'); // Log if no token
    res.status(401).json({ message: 'Not authorized, no token' });
    return;
  }
};

// Middleware for role-based authorization
const authorize = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        if (roles.length && !roles.includes(req.user.role)) {
            // user's role is not authorized
            res.status(403).json({ message: `User role ${req.user.role} is not authorized to access this route` });
            return;
        }

        // authentication and authorization successful
        next();
    };
};

module.exports = { protect, authorize }; 