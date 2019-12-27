const AppError = require('../utils/AppError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicatedFieldsErrorDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0].slice(1, -1);
  const message = `Invalid Request, Duplicate value: ${value}, not allowed.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errorMessages = Object.values(err.errors).map(e => e.message);
  return new AppError(errorMessages, 400);
};

const handleJsonWebTokenError = err => {
  const message = `JWT Error: ${err.message}, Login Required`;
  return new AppError(message, 401);
};

const handleTokenExpiredError = err => {
  const message = `Authentication Failed: ${err.message}, Login Required`;
  return new AppError(message, 401);
};

const sendDevError = (err, req, res) => {
  return res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack
  });
};

const sendProdError = (err, req, res) => {
  if (err.isOperational) {
    console.log(err.message);
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message
    });
  }
  console.error(`Production Error: ${err}`);
  return res.status(500).json({
    success: false,
    status: 'error',
    message: 'Sorry, Something went Wrong'
  });
};

const errorDispatcher = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendDevError(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicatedFieldsErrorDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError')
      error = handleJsonWebTokenError(error);
    if (error.name === 'TokenExpiredError')
      error = handleTokenExpiredError(error);

    sendProdError(error, req, res);
  }
};

module.exports = { errorDispatcher };
