// External module imports
const { validationResult } = require('express-validator');
const fs = require('fs-extra');

// Internal module imports
const { ErrorResponse } = require('../utils');
const { httpStatus } = require('../../config/custom-http-status');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();

  // check whether there have been any errors
  if (Object.keys(mappedErrors).length === 0) {
    return next();
  }

  if (req.file) {
    fs.removeSync(req.file.path);
  }

  if (req.files) {
    req.files.forEach((file) => fs.removeSync(file.path));
  }

  // send error response
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
