class SuccessResponse {
  constructor(
    statusCode = 200,
    message = 'Request processed successfully',
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

module.exports = SuccessResponse;
