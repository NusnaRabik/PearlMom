const jwt = require('jsonwebtoken');
const { User } = require('../models');
const jwtConfig = require('../config/jwtConfig');

/**
 * Protect routes - Verify JWT token and attach user to request
 */
const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, jwtConfig.secret);

      // Get user from database (exclude password)
      const user = await User.findByPk(decoded.user_id, {
        attributes: { exclude: ['password_hash'] }
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found. Please login again.'
        });
      }

      // Check if user is active
      if (!user.is_active) {
        return res.status(401).json({
          success: false,
          message: 'Your account has been deactivated. Please contact support.'
        });
      }

      // Attach user to request object
      req.user = user;
      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token. Please login again.'
        });
      }
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired. Please login again.'
        });
      }
      
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route.'
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. No token provided.'
    });
  }
};

module.exports = { protect };