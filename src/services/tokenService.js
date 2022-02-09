// External module imports
const httpStatus = require('http-status');
const moment = require('moment');
const jwt = require('jsonwebtoken');

// Internal module imports
const config = require('../config/config');
const { ErrorResponse } = require('../utils');
const { tokenTypes } = require('../config/tokens');
const { Token } = require('../models');

/**
 * Save a token
 * @param {ObjectId} userId
 * @param {string} token
 * @param {string} type
 * @param {Moment} expires
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
  if (!tokenDoc) {
    throw new ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      httpStatus[httpStatus.INTERNAL_SERVER_ERROR]
    );
  }
  return tokenDoc;
};

/**
 * Generate signed jwt
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @returns {string}
 */
const generateSignedJWT = (
  userId,
  expires,
  type,
  secret = config.jwt.secret
) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Generate auth tokens
 * @param {ObjectId} userId
 * @returns {Promise}
 */
const generateAuthTokens = async (userId) => {
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
  const accessToken = generateSignedJWT(
    userId,
    accessTokenExpires,
    tokenTypes.ACCESS
  );
  // generate refresh_token
  const refreshToken = generateSignedJWT(
    userId,
    refreshTokenExpires,
    tokenTypes.REFRESH
  );
  // save refresh token to DB
  await saveToken(
    userId,
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
  const { user } = refreshTokenDoc;
  // access_token expires time
  const accessTokenExpires = moment().add(
    config.jwt.accessExpirationMinutes,
    'minutes'
  );
  // generate access_token
  const accessToken = generateSignedJWT(
    user._id,
    accessTokenExpires,
    tokenTypes.ACCESS
  );
  return {
    access_token: accessToken,
    refresh_token: refreshTokenDoc.token,
  };
};

/**
 * Generate reset password token
 * @param {ObjectId} userId
 * @returns {Promise<string>}
 */
const generateResetPasswordToken = async (userId) => {
  const resetPasswordTokenExpires = moment().add(
    config.jwt.resetPasswordExpirationMinutes,
    'minutes'
  );
  // generate access_token
  const resetPasswordToken = generateSignedJWT(
    userId,
    resetPasswordTokenExpires,
    tokenTypes.RESET_PASSWORD
  );
  await saveToken(
    userId,
    resetPasswordToken,
    tokenTypes.RESET_PASSWORD,
    resetPasswordTokenExpires
  );
  return resetPasswordToken;
};

// Module exports
module.exports = {
  saveToken,
  generateSignedJWT,
  generateAuthTokens,
  refreshAuthTokens,
  generateResetPasswordToken,
};
