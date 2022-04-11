// External module imports
const cloudinary = require('cloudinary').v2;

// Internal module imports
const config = require('./config');

// cloudinary configuration
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

// Module exports
module.exports = cloudinary;
