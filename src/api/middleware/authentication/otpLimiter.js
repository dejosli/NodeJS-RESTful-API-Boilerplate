// External module imports
const moment = require('moment');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');

// Internal module imports
const { ErrorResponse } = require('../../utils');

// const windowMs = 15 * 60 * 1000; // 15 minutes
const windowMs = moment().add(15, 'minutes').unix(); // 15 minutes
const allowMaxRequests = 10; // Limit each IP to 10 requests

const rateLimiter = rateLimit({
  windowMs, // time frame, M in milliseconds
  max: allowMaxRequests, // Limit each IP to N requests per `window` (here, per M minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res, next, options) => {
    const { statusCode, message } = options;
    res.locals.errorMessage = message;
    next(new ErrorResponse(statusCode, message));
  },
});

const speedLimiter = slowDown({
  windowMs, // time frame, M in milliseconds
  delayAfter: allowMaxRequests, // allow N requests per M minutes, then...
  delayMs: 500, // begin adding 500ms of delay per request above 100:
  // request # 101 is delayed by  500ms
  // request # 102 is delayed by 1000ms
  // request # 103 is delayed by 1500ms
  // etc.
});

// Module exports
module.exports = [rateLimiter, speedLimiter];
