// External module imports
const path = require('path');
const winston = require('winston');
const WinstonDailyRotateFile = require('winston-daily-rotate-file');

// Internal module imports
const config = require('./config');

// ignore log messages if they have { private: true }
const ignorePrivate = winston.format((info, opts) => {
  if (info.private) {
    return false;
  }
  return info;
});

// show error stack as message
const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

// printf callback
const printFormat = (info) => {
  return `\n${info.timestamp} ${info.level}: ${info.message}`;
};

// define logging format
const logFormat = winston.format.combine(
  ignorePrivate(),
  enumerateErrorFormat(),
  config.env === 'development'
    ? winston.format.colorize()
    : winston.format.uncolorize(),
  winston.format.splat(),
  winston.format.timestamp(),
  winston.format.align(),
  winston.format.prettyPrint(),
  winston.format.printf(printFormat)
);

// define a transport
const transport = new WinstonDailyRotateFile({
  filename: path.resolve(__dirname, '../logs/error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  prepend: true,
  level: 'error',
});

// transport.on('rotate', function (oldFilename, newFilename) {
// call function like upload to s3 or on cloud
// });

// define logger
const logger = winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  format: logFormat,
  transports: [
    transport,
    new winston.transports.Console({
      stderrLevels: ['error'],
    }),
  ],
  exitOnError: false,
});

// Module exports
module.exports = logger;
