// External module imports
const mongoose = require('mongoose');

// Internal module imports
const config = require('./config');
const logger = require('./logger');

const mongodb = {
  url: config.env === 'test' ? `${config.mongodbUrl}-test` : config.mongodbUrl,
  config: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};

/**
 * Connect to MongoDB server
 * @return {object} mongoose connection
 */
const connectDB = async () => {
  logger.info('Trying to connect with MongoDB');
  try {
    const connectionResult = await mongoose.connect(
      mongodb.url,
      mongodb.config
    );
    logger.info(
      `MongoDB Connected to ${
        connectionResult.connections[0].name
      } at ${new Date().toISOString()}`
    );
    return connectionResult;
  } catch (error) {
    if (config.env === 'development') {
      return logger.error(error);
    }
    logger.error(`MongoDB Connection Failed: ${error.message}`);
    logger.info('Force to close the MongoDB connection');
    process.exit(1);
  }
};

// Module exports
module.exports = connectDB;
