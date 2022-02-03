// External module imports
const httpStatus = require('http-status');
const passport = require('passport');

// Internal module imports
const ErrorResponse = require('../utils/ErrorResponse');

const verifyCallback = (req, resolve, reject) => {
  return (err, user, info) => {
    if (err || info || !user) {
      return reject(
        new ErrorResponse(httpStatus.UNAUTHORIZED, 'Please authenticate')
      );
    }
    // set user to request object
    req.user = user;
    resolve();
  };
};

const protect = (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      'jwt',
      { session: false },
      verifyCallback(req, resolve, reject)
    )(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

// Module exports
module.exports = {
  protect,
};
