/**
 * @class SuccessResponse
 * @param {number} statusCode
 * @param {string} message
 * @param {object} data
 * @param {object} metadata
 */
class SuccessResponse {
  constructor(
    statusCode = 200,
    message = 'Successful Response',
    data = null,
    metadata = null
  ) {
    this.success = true;
    this.code = statusCode;
    this.message = message;
    this.data = data;
    if (metadata) {
      this.metadata = metadata;
    }
  }
}

// Module exports
module.exports = SuccessResponse;
