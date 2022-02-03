// External module imports
const moment = require('moment');
const jwt = require('jsonwebtoken');

// Internal module imports
const config = require('../config/config');
const { tokenTypes } = require('../config/tokens');
const { Token } = require('../models');

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
    expires: expires.toDate(),
    blacklisted,
  });
  return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user) => {
  const accessTokenExpires = moment().add(
    config.jwt.accessExpirationMinutes,
    'minutes'
  );
  const refreshTokenExpires = moment().add(
    config.jwt.refreshExpirationDays,
    'days'
  );
  const accessToken = user.getSignedJwtToken(
    accessTokenExpires,
    tokenTypes.ACCESS
  );
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

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
  };
};

// Module exports
module.exports = {
  saveToken,
  generateAuthTokens,
};
