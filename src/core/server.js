// External module imports
const http = require('http');
const https = require('https');

// define http protocol
const PROTOCOLS = {
  http,
  https,
};

// Internal module imports
const config = require('../config/config');
const logger = require('../config/logger');
const app = require('./app');

let server;

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

const startServer = async () => {
  // create http server
  server = PROTOCOLS[config.protocol].createServer(app);

  // listen on provided port, on all network interfaces
  server.listen(config.port, config.host, () => {
    logger.info(
      `Server listening on ${config.protocol}://${config.host}:${config.port}`
    );
  });

  // process exits gracefully
  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);
  process.on('SIGTERM', signalHandler);
  process.on('SIGINT', signalHandler);
  process.on('SIGQUIT', signalHandler);
};

// Module exports
module.exports = { startServer };
