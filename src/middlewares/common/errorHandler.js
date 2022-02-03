// External module imports
const httpStatus = require('http-status');
const mongoose = require('mongoose');

// Internal module imports
const { ErrorResponse } = require('../../utils');
const logger = require('../../config/logger');
const config = require('../../config/config');

const isOperationalError = (err) => {
  if (err instanceof ErrorResponse) {
    return err.isOperational;
  }
  return false;
};

const errorHandler = function (err, req, res, next) {
  let error = { ...err };
  error.message = err.message;

  if (!isOperationalError(err)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ErrorResponse(statusCode, message, false);
  }

  res.locals.errorMessage =
    error.message || httpStatus[httpStatus.INTERNAL_SERVER_ERROR];

  if (config.env === 'development') {
    logger.error(err);
  }

  res.status(error.statusCode || httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    code: error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
    message: error.message || httpStatus[httpStatus.INTERNAL_SERVER_ERROR],
    errors: error.errors,
  });
};

// Module exports
module.exports = errorHandler;
