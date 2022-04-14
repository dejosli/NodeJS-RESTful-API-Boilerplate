// External module imports
require('module-alias/register');
const mongoose = require('mongoose');
const multer = require('multer');

// Internal module imports
const { ErrorResponse } = require('utils');
const logger = require('config/logger');
const config = require('config/config');
const { httpStatus, httpMessage } = require('config/custom-http-status');

const isOperationalError = (err) => {
  if (err instanceof ErrorResponse) {
    return err.isOperational;
  }
  return false;
};

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  if (!isOperationalError(err)) {
    const statusCode =
      error.statusCode ||
      error instanceof mongoose.Error ||
      error instanceof multer.MulterError
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpMessage[statusCode];
    error = new ErrorResponse(statusCode, message, false);
  }

  res.locals.errorMessage =
    error.message || httpMessage[httpStatus.INTERNAL_SERVER_ERROR];

  if (config.env === 'development') {
    logger.error(err);
  }

  res.status(error.statusCode || httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    code: error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
    message: error.message || httpMessage[httpStatus.INTERNAL_SERVER_ERROR],
    errors: error.errors,
  });
};

// Module exports
module.exports = errorHandler;
