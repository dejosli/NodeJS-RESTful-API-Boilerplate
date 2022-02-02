const mongoose = require('mongoose');

const config = require('./config');
const logger = require('./logger');

const mongodb = {
  url: config.env === 'test' ? `${config.mongodbUrl}-test` : config.mongodbUrl,
  config: {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  },
};

const connectDB = function () {
  mongoose
    .connect(mongodb.url, mongoose.config)
    .then(() => {
      logger.info(
        `MongoDB Connected at ${mongoose.connection.host}:${mongoose.connection.port}`
      );
    })
    .catch((err) => {
      if (config.env === 'development') {
        return logger.error(err);
      }
      logger.error(`MongoDB Connection Failed: ${err.message}`);
      process.exit(1);
    });
};

module.exports = connectDB;
