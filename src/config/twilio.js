// External module imports
const twilio = require('twilio');

// Internal module imports
const config = require('./config');

// twilio configuration
// const clientOptions = {}; // uncomment if configuration is needed

// create twilio client instance
const client = twilio(
  config.twilio.accountSid,
  config.twilio.authToken
  // clientOptions // uncomment if configuration is needed
);

const { phoneNumber } = config.twilio;

// Module exports
module.exports = { client, phoneNumber };
