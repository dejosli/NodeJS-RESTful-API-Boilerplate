// External module imports
const moment = require('moment');
const jwt = require('jsonwebtoken');

// Internal module imports
const config = require('../../config/config');
const { ErrorResponse } = require('../utils');
const { genUniqueId } = require('../utils').common;
const { tokenTypes } = require('../../config/tokens');
const { Token } = require('../models');
const { httpStatus, httpMessage } = require('../../config/custom-http-status');

/**
 * Save a token
 * @param {ObjectId} userId
 * @param {ObjectId} deviceId
 * @param {string} token
 * @param {string} type
 * @param {Moment} expires
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveToken = async (
  userId,
  deviceId,
  token,
  type,
  expires,
  blacklisted = false
) => {
  const tokenBody = {
    user: userId,
    token,
    type,
    expireAt: expires.toDate(),
    blacklisted,
  };
  if (deviceId) {
    tokenBody.deviceId = deviceId;
  }
  const tokenDoc = await Token.create(tokenBody);
  if (!tokenDoc) {
    throw new ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      httpMessage[httpStatus.INTERNAL_SERVER_ERROR]
    );
  }
  return tokenDoc;
};

/**
 * Generate signed token
 * @param {ObjectId} userId
 * @param {ObjectId} deviceId
 * @param {string} type
 * @param {string} secret
 * @param {Moment} expires
 * @param {string} issuer
 * @param {string} audience
 * @returns {string} a signed token
 */
const generateSignedJWT = (
  userId,
  deviceId,
  type,
  secret,
  expires,
  issuer,
  audience
) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    iss: issuer,
    aud: audience,
    type,
  };
  const options = { algorithm: 'HS384' };
  if (deviceId) {
    options.jwtid = `${deviceId}`;
  }
  return jwt.sign(payload, secret, options);
};

/**
 * Generate auth tokens
 * @param {ObjectId} userId
 * @returns {Promise<object>}
 */
const generateAuthTokens = async (userId) => {
  // create a random device id
  const deviceId = genUniqueId();

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
    deviceId,
    tokenTypes.ACCESS,
    config.jwt.accessSecret,
    accessTokenExpires,
    config.jwt.issuer
  );
  // generate refresh_token
  const refreshToken = generateSignedJWT(
    userId,
    deviceId,
    tokenTypes.REFRESH,
    config.jwt.refreshSecret,
    refreshTokenExpires,
    config.jwt.issuer
  );
  // save refresh token to DB
  await saveToken(
    userId,
    deviceId,
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
    null,
    tokenTypes.RESET_PASSWORD,
    config.jwt.resetPasswordSecret,
    resetPasswordTokenExpires,
    config.jwt.issuer
  );
  await saveToken(
    userId,
    null,
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
    null,
    tokenTypes.VERIFY_EMAIL,
    config.jwt.verifyEmailSecret,
    verifyEmailTokenExpires,
    config.jwt.issuer
  );
  await saveToken(
    userId,
    null,
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
  generateResetPasswordToken,
  generateVerifyEmailToken,
};
