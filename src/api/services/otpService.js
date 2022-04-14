// External module imports
require('module-alias/register');
const speakeasy = require('speakeasy');

// Internal module imports
const config = require('config/config');
const { ErrorResponse } = require('utils');
const { OTP } = require('models');
const { httpStatus, httpMessage } = require('config/custom-http-status');

/**
 * Custom authentication URL for SHA512
 * @param {string} secret
 * @param {string} email
 * @return {string} otpauth_url
 */
const generateQRCodeURL = (secret, email) => {
  const options = {
    secret,
    label: email, // used to identify the account
    algorithm: 'sha512',
    issuer: config.appName,
  };
  // return otpauth_url for qr code
  return speakeasy.otpauthURL(options);
};

/**
 * generate a secret key
 * @param {string} email
 * @return {object} secret key and otpauth_url
 */
const generateSecretKey = (email) => {
  const options = {
    length: 64,
    name: email,
    issuer: config.appName,
  };

  // get secret key based on base32 encoding
  const secretKey = speakeasy.generateSecret(options).base32;
  const url = generateQRCodeURL(secretKey, email);

  // return otp auth object
  return { secretKey, url };
};

/**
 * Generate a time-based token based on the base-32 key
 * @param {string} secret
 * @return {number} otp code
 */
const getToken = (secret) => {
  const options = {
    secret,
    // time: Date.now(),
    algorithm: 'sha512',
    encoding: 'base32', // encoding used for secret
  };
  // return time-based token
  return speakeasy.time(options);
};

/**
 * Verify a given token
 * @param {string} token
 * @param {string} secret
 * @param {number} step
 * @param {number} window
 * @return {boolean} boolean
 */
const verifyToken = (token, secret, step = 30, window = 0) => {
  const options = {
    token,
    secret,
    step,
    window,
    // time: Date.now(),
    algorithm: 'sha512',
    encoding: 'base32', // encoding used for secret
  };
  const verified = speakeasy.totp.verify(options);
  if (!verified) {
    throw new ErrorResponse(
      httpStatus.UNAUTHORIZED,
      httpMessage.OTP_VERIFICATION_ERROR
    );
  }
  return verified;
};

/**
 * Save OTP secretKey
 * @param {string} secretKey
 * @param {ObjectId} userId
 * @param {string} verificationMethod
 * @param {boolean} [verified]
 * @returns {Promise}
 */
const saveSecretKey = async (
  secretKey,
  userId,
  verificationMethod,
  verified = false
) => {
  const otpDoc = await OTP.create({
    user: userId,
    secretKey,
    verified,
    verificationMethod,
  });
  if (!otpDoc) {
    throw new ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      httpMessage[httpStatus.INTERNAL_SERVER_ERROR]
    );
  }
  return otpDoc;
};

/**
 * Get OTP document
 * @param {object} filter
 * @returns {Promise}
 */
const getSecretKey = async (filter) => {
  const otpDoc = await OTP.findOne(filter);
  if (!otpDoc) {
    throw new ErrorResponse(
      httpStatus.NOT_FOUND,
      httpMessage[httpStatus.NOT_FOUND]
    );
  }
  return otpDoc;
};

/**
 * Update OTP document
 * @param {object} filter
 * @param {object} updateBody
 * @returns {Promise}
 */
const updateSecretKey = async (filter, updateBody) => {
  const otpDoc = await OTP.updateOne(filter, updateBody, {
    new: true,
    runValidators: true,
  });
  if (!otpDoc) {
    throw new ErrorResponse(
      httpStatus.NOT_FOUND,
      httpMessage[httpStatus.NOT_FOUND]
    );
  }
  return otpDoc;
};

/**
 * Delete single OTP document
 * @param {object} filter
 * @returns {Promise}
 */
const deleteOneSecretKey = async (filter) => {
  const otpDoc = await OTP.deleteOne(filter);
  if (!otpDoc) {
    throw new ErrorResponse(
      httpStatus.NOT_FOUND,
      httpMessage[httpStatus.NOT_FOUND]
    );
  }
  return otpDoc;
};

/**
 * Delete multiple OTP documents
 * @param {object} filter
 * @returns {Promise}
 */
const deleteManySecretKey = async (filter) => {
  const otpDoc = await OTP.deleteMany(filter);
  if (!otpDoc) {
    throw new ErrorResponse(
      httpStatus.NOT_FOUND,
      httpMessage[httpStatus.NOT_FOUND]
    );
  }
  return otpDoc;
};

/**
 * Generate and save OTP secret key
 * @param {object.<User>} user
 * @param {string} verificationMethod
 * @returns {Promise}
 */
const generateOtpCode = async (user, verificationMethod) => {
  const { _id: userId, email } = user;
  const { secretKey } = await generateSecretKey(email);
  const otpDoc = await saveSecretKey(secretKey, userId, verificationMethod);
  return otpDoc;
};

// Module exports
module.exports = {
  generateQRCodeURL,
  generateSecretKey,
  getToken,
  verifyToken,
  saveSecretKey,
  getSecretKey,
  updateSecretKey,
  deleteOneSecretKey,
  deleteManySecretKey,
  generateOtpCode,
};
