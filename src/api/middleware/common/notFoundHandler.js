// External module imports
require('module-alias/register');

// Internal module imports
const { ErrorResponse } = require('utils');

const notFoundHandler = async (req, res, next) => {
  next(new ErrorResponse(404, 'Not Found'));
};

// Module exports
module.exports = notFoundHandler;
