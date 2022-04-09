// External module imports
const http = require('http');

// Internal module imports
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const connectDB = require('./config/database');

// database connection
connectDB();

// create http server
const server = http.createServer(app);

// listen on provided port, on all network interfaces
server.listen(config.port, () => {
  logger.info(`Server listening on port ${config.port}`);
});

// process exit handlers
const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Force to close the Server');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(`An unexpected error occurred - ${error}`);
  exitHandler();
};

const signalHandler = (signal) => {
  logger.info(`Received: ${signal}`);
  exitHandler();
};

// process exits gracefully
process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
process.on('SIGTERM', signalHandler);
process.on('SIGINT', signalHandler);
process.on('SIGQUIT', signalHandler);
