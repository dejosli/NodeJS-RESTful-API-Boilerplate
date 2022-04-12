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
  level: 6, // the level of zlib compression to apply to responses
  filter: shouldCompress, //  should be compressed or not
  threshold: 10000, // body size(in bytes) before considering compression
});
