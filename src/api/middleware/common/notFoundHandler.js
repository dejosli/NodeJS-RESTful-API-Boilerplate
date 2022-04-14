// External module imports
require('module-alias/register');

// Internal module imports
const { ErrorResponse } = require('utils');
const { httpStatus, httpMessage } = require('config/custom-http-status');

const notFoundHandler = async (req, res, next) => {
  next(
    new ErrorResponse(httpStatus.NOT_FOUND, httpMessage[httpStatus.NOT_FOUND])
  );
};

// Module exports
module.exports = notFoundHandler;
