// Internal module imports
const { ErrorResponse } = require('../../utils');
const {
  httpStatus,
  httpMessage,
} = require('../../../config/custom-http-status');

// check whether permissions are allowed or denied
const grantAccess = (req, res, next) => {
  if (req?.permission?.allow) {
    return next();
  }
  return next(
    new ErrorResponse(httpStatus.FORBIDDEN, httpMessage[httpStatus.FORBIDDEN])
  );
};

// Module exports
module.exports = grantAccess;
