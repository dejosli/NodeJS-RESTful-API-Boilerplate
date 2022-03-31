// External module imports
const speakeasy = require('speakeasy');
const httpStatus = require('http-status');

// Internal module imports
const config = require('../config/config');
const { ErrorResponse } = require('../utils');
const { OTP } = require('../models');

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
const generateOTP = (secret) => {
  const options = {
    secret,
    algorithm: 'sha512',
    encoding: 'base32', // encoding used for secret
  };
  // return time-based token
  return speakeasy.totp(options);
};

/**
 * Verify a given token
 * @param {string} token
 * @param {string} secret
 * @param {number} step
 * @param {number} window
 * @return {boolean} boolean
 */
const verifyOTP = (token, secret, step = 30, window = 0) => {
  const options = {
    token,
    secret,
    step,
    window,
    encoding: 'base32', // encoding used for secret
  };
  // return token validation result
  return speakeasy.totp.verify(options);
};

const saveSecretKey = async (secretKey, userId, verified, serviceType) => {
  const otpDoc = await OTP.create({
    secretKey,
    verified,
    serviceType,
    user: userId,
  });
  if (!otpDoc) {
    throw new ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      httpStatus[httpStatus.INTERNAL_SERVER_ERROR]
    );
  }
  return otpDoc;
};

const findSecretKey = async (filter) => {
  const otpDoc = await OTP.findOne(filter);
  if (!otpDoc) {
    throw new ErrorResponse(httpStatus.NOT_FOUND, 'OTP secret key not found');
  }
  return otpDoc;
};

const updateSecretKey = async (filter, updateBody) => {
  const otpDoc = await OTP.updateOne(filter, updateBody, {
    new: true,
    runValidators: true,
  });
  if (!otpDoc) {
    throw new ErrorResponse(
      httpStatus.NOT_FOUND,
      'OTP secret key update failed'
    );
  }
  return otpDoc;
};

const deleteOneSecretKey = async (filter) => {
  const otpDoc = await OTP.deleteOne(filter);
  if (!otpDoc) {
    throw new ErrorResponse(
      httpStatus.NOT_FOUND,
      'OTP secret key deletion failed'
    );
  }
  return otpDoc;
};

const deleteManySecretKey = async (filter) => {
  const otpDoc = await OTP.deleteMany(filter);
  if (!otpDoc) {
    throw new ErrorResponse(
      httpStatus.NOT_FOUND,
      'OTP secret key deletion failed'
    );
  }
  return otpDoc;
};

// Module exports
module.exports = {
  generateQRCodeURL,
  generateSecretKey,
  generateOTP,
  verifyOTP,
  saveSecretKey,
  findSecretKey,
  updateSecretKey,
  deleteOneSecretKey,
  deleteManySecretKey,
};
