// External module imports
const passport = require('passport');

// Internal module imports
const {
  httpStatus,
  httpMessage,
} = require('../../../config/custom-http-status');
const { ErrorResponse } = require('../../utils');
const config = require('../../../config/config');

/**
 * Callbacks
 */

const verifyCallback = (req, resolve, reject) => {
  return (err, user, info) => {
    if (err || !user) {
      return reject(
        new ErrorResponse(
          httpStatus.UNAUTHORIZED,
          httpMessage.OAUTH_VERIFICATION_ERROR
        )
      );
    }
    // set user to request object
    req.user = user;
    resolve();
  };
};

/**
 * OAuth Authentications
 */

const authorizeOAuth = (strategyName) => {
  return (req, res, next) => {
    return new Promise((resolve, reject) => {
      passport.authenticate(
        strategyName,
        { session: config.jwt.session },
        verifyCallback(req, resolve, reject)
      )(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };
};

// Module exports
module.exports = {
  authorizeGoogleOAuth: authorizeOAuth('google'),
  authorizeFacebookOAuth: authorizeOAuth('facebook'),
};
