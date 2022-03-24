/**
 * @extends Error
 * @param {number} statusCode
 * @param {string} message
 * @param {object} errors
 * @param {boolean} isOperational
 */
class ErrorResponse extends Error {
  constructor(statusCode, message, errors = null, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Module exports
module.exports = ErrorResponse;
