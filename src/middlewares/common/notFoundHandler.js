const ErrorResponse = require('../../utils/ErrorResponse');

const notFoundHandler = async function (req, res, next) {
  next(new ErrorResponse(404, 'Not Found'));
};

module.exports = notFoundHandler;
