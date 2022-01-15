// External module imports
const http = require('http');

// Internal module imports
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');

// init server
const server = http.createServer(app);

server.listen(config.port, () => {
  logger.info(`Server listening on port ${config.port}`);
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
