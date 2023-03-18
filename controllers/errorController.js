// eslint-disable-next-line import/no-useless-path-segments
const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  // (/(["'])(\\?.)*?\1/) -> To return array of strings between quotes
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError(`Invalid Token Please Login Again`, 401);

const handleJWTExpiredError = () =>
  new AppError(`Your Token has Expired.Kindly Login Again`, 401);

const sendErrorDev = (err, req, res) => {
  //A) API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  //B) RENDERED WEBSITES
  console.error(`ERROR`, err);
  return res.status(err.statusCode).render('error', {
    title: 'Something Went Wrong',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });

      //Programming or other unknown error: don't leak error details.
    }
    // 1) Log Error
    console.error(`ERROR`, err);

    // 2) Send generic error
    return res.status(500).json({
      status: 'Error',
      message: 'Something went Wrong',
    });
  }
  //B) Rendered Website
  //Operational,trusted Error:send to client
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something Went Wrong',
      msg: err.message,
    });
  }
  // B) Programming or other unknown error: don't leak error details.

  // 2) Send generic error
  return res.status(err.statusCode).render('error', {
    title: 'Something Went Wrong',
    msg: `Please try again later.`,
  });
};

module.exports = (err, req, res, next) => {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    let error = { ...err };
    error.message = err.message;
    if (error.name === 'CastError') error = handleCastErrorDB(error);

    if (error.code === 11000) error = handleDuplicateFieldsDB(error);

    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);

    if (err.name === 'JsonWebTokenError') error = handleJWTError();

    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
