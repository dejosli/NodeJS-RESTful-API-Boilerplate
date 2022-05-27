// Internal module imports
const { ErrorResponse } = require('../utils');
const { client, phoneNumber } = require('../../config/twilio');
const { httpStatus } = require('../../config/custom-http-status');

/**
 * Send a SMS
 * @param {string} to
 * @param {string} text
 * @return {Promise<object>}
 */
const sendSMS = async (to, text) => {
  const msg = { body: text, to, from: phoneNumber };
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
 * @return {Promise<object>}
 */
const sendMMS = async (to, text, mediaUrl) => {
  const msg = { body: text, mediaUrl, to, from: phoneNumber };
  const info = await client.messages.create(msg);
  if (!info.sid || info.error_code || info.error_message) {
    throw new ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      `MMS sent error: ${info.sid}`
    );
  }
  return info;
};

/**
 * Send two factor authentication code in sms
 * @param {string} to
 * @param {string} token
 * @return {Promise<object>}
 */
const sendOtpSMS = async (to, token) => {
  const text = `${token} is your authentication code.`;
  const info = await sendSMS(to, text);
  return info;
};

// Module exports
module.exports = {
  sendSMS,
  sendMMS,
  sendOtpSMS,
};
