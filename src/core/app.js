// External module imports
const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const passport = require('passport');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');

// Internal module imports
const compression = require('../config/compression');
const cors = require('../config/cors');
const morgan = require('../config/morgan');
const routes = require('../api/routes/v1');
const errorHandler = require('../api/middleware/common/errorHandler');
const notFoundHandler = require('../api/middleware/common/notFoundHandler');
const ignoreFavicon = require('../api/middleware/common/ignoreFavicon');

// create express app
const app = express();

// set number of trust proxies
app.set('trust proxy', 1);

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

// enable cors and pre-flight requests for all routes
app.use(cors);

// passport config
require('../config/passport-auth')(passport);
require('../config/passport-oauth')(passport);

app.use(passport.initialize());

// mount api v1 routes
app.use('/api/v1', routes);

// catch the favicon.ico request and send a 204 status
app.use(ignoreFavicon);

// catch 404 and forward to error handler
app.use(notFoundHandler);

// error handler, send stacktrace only during development
app.use(errorHandler);

// Module exports
module.exports = app;
