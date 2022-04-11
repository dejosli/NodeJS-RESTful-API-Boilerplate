// External module imports
const moment = require('moment');

// Internal module imports
const config = require('../../config/config');
const SuccessResponse = require('./SuccessResponse');

/**
 * Send cookie(jsonwebtoken) as response
 * @param {object.<Response>} res
 * @param {User} user
 * @param {object} tokens
 * @param {number} statusCode
 * @param {string} msg
 * @return send response to client
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
  res.cookie('tokens', tokens, options);
  // send json response
  if (!user) {
    return res
      .status(statusCode)
      .json(new SuccessResponse(statusCode, msg, { tokens }));
  }
  return res
    .status(statusCode)
    .json(new SuccessResponse(statusCode, msg, { user, tokens }));
};

// Module exports
module.exports = sendTokenResponse;
