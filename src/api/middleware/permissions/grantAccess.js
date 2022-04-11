// External module imports
const httpStatus = require('http-status');

// Internal module imports
const { ErrorResponse } = require('../../utils');

// check whether permissions are allowed or denied
const grantAccess = (req, res, next) => {
  if (req?.permission?.allow) {
    return next();
  }
  return next(
    new ErrorResponse(
      httpStatus.FORBIDDEN,
      `Access Denied - You don't have permission`
    )
  );
};

// Module exports
module.exports = grantAccess;
