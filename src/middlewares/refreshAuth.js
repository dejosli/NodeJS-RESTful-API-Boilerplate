// External module imports
const httpStatus = require('http-status');
const passport = require('passport');

// Internal module imports
const { ErrorResponse } = require('../utils');

const verifyCallback = (req, resolve, reject) => {
  return (err, refreshToken, info) => {
    if (err || info || !refreshToken) {
      return reject(
        new ErrorResponse(httpStatus.UNAUTHORIZED, 'Please authenticate')
      );
    }
    // set refreshToken to request object
    req.refreshToken = refreshToken;
    resolve();
  };
};

const refreshAuth = (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      'jwt_refresh',
      { session: false },
      verifyCallback(req, resolve, reject)
    )(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

// Module exports
module.exports = refreshAuth;
