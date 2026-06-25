// Global error handling middleware

class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle MongoDB duplicate key errors
 */
function handleDuplicateKeyError(err) {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  return new AppError(`${field} '${value}' already exists`, 400);
}

/**
 * Handle MongoDB validation errors
 */
function handleValidationError(err) {
  const errors = Object.values(err.errors).map(e => e.message);
  return new AppError(`Invalid input: ${errors.join('. ')}`, 400);
}

/**
 * Handle MongoDB cast errors
 */
function handleCastError(err) {
  return new AppError(`Invalid ${err.path}: ${err.value}`, 400);
}

/**
 * Main error handler middleware
 */
function errorHandler(err, req, res, next) {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Log error for debugging
  if (process.env.NODE_ENV === 'development') {
    console.error('ERROR 💥:', err);
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    error = handleDuplicateKeyError(err);
  }

  // MongoDB validation error
  if (err.name === 'ValidationError') {
    error = handleValidationError(err);
  }

  // MongoDB cast error
  if (err.name === 'CastError') {
    error = handleCastError(err);
  }

  // Operational errors - send to client
  if (error.isOperational) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }

  // Programming or unknown errors - send generic message
  console.error('ERROR 💥:', err);
  return res.status(500).json({
    success: false,
    error: 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && {
      message: err.message,
      stack: err.stack
    })
  });
}

/**
 * Catch async errors wrapper
 */
function catchAsync(fn) {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}

/**
 * 404 Not Found handler
 */
function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`
  });
}

module.exports = {
  AppError,
  errorHandler,
  catchAsync,
  notFoundHandler
};
