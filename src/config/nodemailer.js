// External module imports
const nodemailer = require('nodemailer');

// Internal module imports
const config = require('./config');
const logger = require('./logger');

const transporterOptions = {
  ...config.email.smtp,
  debug: config.env === 'development',
  logger: config.env === 'development',
};

// create reusable transporter object using the default SMTP transport
const createTransporter = async () => {
  const transporter = nodemailer.createTransport(transporterOptions);

  // verify connection configuration
  if (config.env === 'development') {
    logger.info('Checking connection to email server');
    transporter
      .verify()
      .then(() =>
        logger.info(`Connected to email server at ${new Date().toISOString()}`)
      )
      .catch(() =>
        logger.warn(
          'Unable to connect to email server. Make sure you have configured the SMTP options in .env'
        )
      );
  }

  return transporter;
};

// Module exports
module.exports = {
  createTransporter,
};
