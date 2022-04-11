// External module imports
const httpStatus = require('http-status');
const moment = require('moment');
const jwt = require('jsonwebtoken');

// Internal module imports
const config = require('../../config/config');
const { ErrorResponse } = require('../utils');
const { tokenTypes } = require('../../config/tokens');
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
 * Generate signed token
 * @param {object} payload
 * @param {string} secret
 * @param {object} options
 * @returns {string} a signed token
 */
const generateSignedJWT = (userId, type, secret, expires, issuer, audience) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    iss: issuer,
    aud: audience,
    type,
  };
  return jwt.sign(payload, secret, { algorithm: 'HS384' });
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
    tokenTypes.ACCESS,
    config.jwt.accessSecret,
    accessTokenExpires,
    config.jwt.issuer
  );
  // generate refresh_token
  const refreshToken = generateSignedJWT(
    userId,
    tokenTypes.REFRESH,
    config.jwt.refreshSecret,
    refreshTokenExpires,
    config.jwt.issuer
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
 * Generate access token
 * @param {Object} refreshTokenDoc
 * @returns {Promise}
 */
const refreshAuthTokens = async (refreshTokenDoc) => {
  const { user } = refreshTokenDoc;
  // token expires time
  const accessTokenExpires = moment().add(
    config.jwt.accessExpirationMinutes,
    'minutes'
  );
  // generate token
  const accessToken = generateSignedJWT(
    user._id,
    tokenTypes.ACCESS,
    config.jwt.accessSecret,
    accessTokenExpires,
    config.jwt.issuer
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
  // generate token
  const resetPasswordToken = generateSignedJWT(
    userId,
    tokenTypes.RESET_PASSWORD,
    config.jwt.resetPasswordSecret,
    resetPasswordTokenExpires,
    config.jwt.issuer
  );
  await saveToken(
    userId,
    resetPasswordToken,
    tokenTypes.RESET_PASSWORD,
    resetPasswordTokenExpires
  );
  return resetPasswordToken;
};

/**
 * Generate verify email token
 * @param {ObjectId} userId
 * @returns {Promise<string>}
 */
const generateVerifyEmailToken = async (userId) => {
  const verifyEmailTokenExpires = moment().add(
    config.jwt.verifyEmailExpirationMinutes,
    'minutes'
  );
  // generate token
  const verifyEmailToken = generateSignedJWT(
    userId,
    tokenTypes.VERIFY_EMAIL,
    config.jwt.verifyEmailSecret,
    verifyEmailTokenExpires,
    config.jwt.issuer
  );
  await saveToken(
    userId,
    verifyEmailToken,
    tokenTypes.VERIFY_EMAIL,
    verifyEmailTokenExpires
  );
  return verifyEmailToken;
};

// Module exports
module.exports = {
  saveToken,
  generateSignedJWT,
  generateAuthTokens,
  refreshAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken,
};
