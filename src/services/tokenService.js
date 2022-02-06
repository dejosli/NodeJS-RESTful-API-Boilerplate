// External module imports
const moment = require('moment');

// Internal module imports
const config = require('../config/config');
const { tokenTypes } = require('../config/tokens');
const { Token, User } = require('../models');

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveToken = async (userId, token, type, expires, blacklisted = false) => {
  const tokenDoc = await Token.create({
    user: userId,
    token,
    type,
    expireAt: expires.toDate(),
    blacklisted,
  });
  return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise}
 */
const generateAuthTokens = async (user) => {
  // access_token expires time
  const accessTokenExpires = moment().add(
    config.jwt.accessExpirationMinutes,
    'minutes'
  );
  // refresh_token expires time
  const refreshTokenExpires = moment().add(
    config.jwt.refreshExpirationDays,
    'days'
  );
  // generate access_token
  const accessToken = user.getSignedJwtToken(
    accessTokenExpires,
    tokenTypes.ACCESS
  );
  // generate refresh_token
  const refreshToken = user.getSignedJwtToken(
    refreshTokenExpires,
    tokenTypes.REFRESH
  );
  // save refresh token to DB
  await saveToken(
    user._id,
    refreshToken,
    tokenTypes.REFRESH,
    refreshTokenExpires
  );
  // return tokens
  return {
    access_token: accessToken,
    refresh_token: refreshToken,
  };
};

/**
 * Generate auth tokens
 * @param {Object} refreshTokenDoc
 * @returns {Promise}
 */
const refreshAuthTokens = async (refreshTokenDoc) => {
  let { user } = refreshTokenDoc;
  user = await User.findById(user._id);
  // access_token expires time
  const accessTokenExpires = moment().add(
    config.jwt.accessExpirationMinutes,
    'minutes'
  );
  // generate access_token
  const accessToken = user.getSignedJwtToken(
    accessTokenExpires,
    tokenTypes.ACCESS
  );
  return {
    access_token: accessToken,
    refresh_token: refreshTokenDoc.token,
  };
};

// Module exports
module.exports = {
  saveToken,
  generateAuthTokens,
  refreshAuthTokens,
};
