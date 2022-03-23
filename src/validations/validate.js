// External module imports
const { validationResult } = require('express-validator');
const httpStatus = require('http-status');

// Internal module imports
const { ErrorResponse } = require('../utils');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();
  if (Object.keys(mappedErrors).length === 0) {
    return next();
  }
  // pass the errors to next
  return next(
    new ErrorResponse(
      httpStatus.BAD_REQUEST,
      httpStatus[httpStatus.BAD_REQUEST],
      mappedErrors
    )
  );
};

// Module exports
module.exports = validate;
