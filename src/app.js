// External module imports
const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');

// Internal module imports
const compression = require('./config/compression');
const config = require('./config/config');
const logger = require('./config/logger');
const morgan = require('./config/morgan');
const routes = require('./routes/v1');
const errorHandler = require('./middlewares/common/errorHandler');
const notFoundHandler = require('./middlewares/common/notFoundHandler');

// create express app
const app = express();

// set logger
app.use(morgan.successHandler);
app.use(morgan.errorHandler);

// set security HTTP headers
app.use(helmet());
app.use(hpp());

// override client http-request methods
app.use(methodOverride());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// parse cookies request body
app.use(cookieParser());

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression);

// enable cors
app.use(cors());
app.options('*', cors());

// mount api v1 routes
app.use('/api/v1', routes);

// catch 404 and forward to error handler
app.use(notFoundHandler);

// error handler, send stacktrace only during development
app.use(errorHandler);

// Module exports
module.exports = app;
