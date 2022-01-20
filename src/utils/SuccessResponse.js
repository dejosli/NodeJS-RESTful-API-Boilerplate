class SuccessResponse {
  constructor(statusCode, message, data, metadata = null) {
    this.success = true;
    this.code = statusCode || 200;
    this.message = message || 'Request has been processed successfully';
    this.data = data || null;
    if (metadata) {
      this.metadata = metadata;
    }
  }
}

module.exports = SuccessResponse;
