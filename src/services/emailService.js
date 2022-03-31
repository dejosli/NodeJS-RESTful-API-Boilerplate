// External module imports
const httpStatus = require('http-status');
const nodemailer = require('nodemailer');

// Internal module imports
const config = require('../config/config');
const logger = require('../config/logger');
const { ErrorResponse } = require('../utils');

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport(config.email.smtp);

if (config.env !== 'test') {
  transporter
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() =>
      logger.warn(
        'Unable to connect to email server. Make sure you have configured the SMTP options in .env'
      )
    );
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @return {Promise<object>}
 */
const sendEmail = async (to, subject, text) => {
  const msg = { from: config.email.from, to, subject, text };
  const info = await transporter.sendMail(msg);
  if (!info.messageId) {
    throw new ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Email sent error: ${info.messageId}`
    );
  }
  return info;
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} name
 * @param {string} token
 * @return {Promise}
 */
const sendResetPasswordEmail = async (to, name, token) => {
  const subject = 'Reset Password';
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
  const text = `Dear ${name}, To reset your password, please click on this link: ${resetPasswordUrl}
  If you did not request any password resets, then ignore this email.`;
  const info = await sendEmail(to, subject, text);
  return info;
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} name
 * @param {string} token
 * @return {Promise}
 */
const sendVerificationEmail = async (to, name, token) => {
  const subject = 'Email Verification';
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
  const text = `Dear ${name}, To verify your email, please click on this link: ${verificationEmailUrl}
  If you did not create an account, then ignore this email.`;
  const info = await sendEmail(to, subject, text);
  return info;
};

/**
 * Send two factor authentication code in email
 * @param {string} to
 * @param {string} name
 * @param {string} otpCode
 * @return {Promise}
 */
const sendOtpEmail = async (to, name, otpCode) => {
  const subject = 'Authentication Code';
  const text = `Dear ${name}, ${otpCode} is your authentication code.`;
  const info = await sendEmail(to, subject, text);
  return info;
};

// Module exports
module.exports = {
  transporter,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendOtpEmail,
};
