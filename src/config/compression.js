// External module imports
const compression = require('compression');

// Compress all HTTP responses
const shouldCompress = (req, res) => {
  if (req.headers['x-no-compression']) {
    // Will not compress responses, if this header is present
    return false;
  }
  // Resort to standard compression
  return compression.filter(req, res);
};

// Module exports
module.exports = compression({
  // filter: Decide if the answer should be compressed or not,
  // depending on the 'shouldCompress' function above
  filter: shouldCompress,
  // threshold: It is the byte threshold for the response
  // body size before considering compression, the default is 1 kB
  threshold: 0,
});
