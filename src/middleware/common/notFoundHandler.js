// Internal module imports
const { ErrorResponse } = require('../../utils');

const notFoundHandler = async function (req, res, next) {
  next(new ErrorResponse(404, 'Not Found'));
};

// Module exports
module.exports = notFoundHandler;
