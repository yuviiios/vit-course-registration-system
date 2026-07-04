const { verifyAccessToken } = require('../config/auth');
const { AppError } = require('./errorHandler');

/**
 * Middleware to protect routes - requires valid JWT token
 */
async function protect(req, res, next) {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Not authenticated. Please log in.', 401));
    }

    // Verify token
    const decoded = verifyAccessToken(token);

    // Attach student info to request
    req.student = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token. Please log in again.', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token expired. Please log in again.', 401));
    }
    return next(new AppError('Authentication failed', 401));
  }
}

/**
 * Middleware to restrict access to specific roles
 */
function restrictTo(...roles) {
  return (req, res, next) => {
    if (!req.student) {
      return next(new AppError('Not authenticated', 401));
    }

    if (!roles.includes(req.student.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
}

/**
 * Optional auth middleware - attaches user if token exists, but doesn't require it
 */
async function optionalAuth(req, res, next) {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = verifyAccessToken(token);
      req.student = decoded;
    }

    next();
  } catch (error) {
    // Token invalid/expired - continue without auth
    next();
  }
}

module.exports = {
  protect,
  restrictTo,
  optionalAuth,
};
