// External module imports
const httpStatus = require('http-status');
const twilio = require('twilio');

// Internal module imports
const config = require('../config/config');
const { ErrorResponse } = require('../utils');

// twilio configuration
// const clientOptions = {}; // uncomment if configuration is needed

// twilio client instance
const client = twilio(
  config.twilio.accountSid,
  config.twilio.authToken
  // clientOptions // uncomment if configuration is needed
);

/**
 * Send a SMS
 * @param {string} to
 * @param {string} text
 * @returns {Promise<Object>}
 */
const sendSms = async (to, text) => {
  const msg = { body: text, to, from: config.twilio.phoneNumber };
  const info = await client.messages.create(msg);
  if (!info.sid || info.error_code || info.error_message) {
    throw new ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      `SMS sent error: ${info.sid}`
    );
  }
  return info;
};

/**
 * Send a SMS
 * @param {string} to
 * @param {string} text
 * @param {string} mediaUrl
 * @returns {Promise<Object>}
 */
const sendMms = async (to, text, mediaUrl) => {
  const msg = { body: text, mediaUrl, to, from: config.twilio.phoneNumber };
  const info = await client.messages.create(msg);
  if (!info.sid || info.error_code || info.error_message) {
    throw new ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      `MMS sent error: ${info.sid}`
    );
  }
  return info;
};

// Module exports
module.exports = {
  sendSms,
  sendMms,
};
