// External module imports
const moment = require('moment');

// Internal module imports
const config = require('../config/config');
const SuccessResponse = require('./SuccessResponse');

/**
 * Send cookie(jsonwebtoken) as response
 * @param {Object} res
 * @param {User} user
 * @param {Object} tokens
 * @param {number} statusCode
 * @param {string} msg
 */
const sendTokenResponse = (res, user, tokens, statusCode, msg) => {
  // set cookie expires time
  const cookieExpires = moment().add(config.jwt.cookieExpirationDays, 'days');
  // cookie options
  const options = {
    expires: cookieExpires.toDate(),
    httpOnly: true,
    secure: false,
  };

  // secure cookies in production
  if (config.env === 'production') {
    options.secure = true;
  }

  // send cookie to client
  res
    .status(statusCode)
    .cookie('tokens', tokens, options)
    .json(new SuccessResponse(statusCode, msg, { user, tokens }));
};

// Module exports
module.exports = sendTokenResponse;
