class SuccessResponse {
  constructor(statusCode = 200, message = 'Okay', data = null) {
    this.success = true;
    this.code = statusCode;
    this.message = message;
    if (data) {
      this.data = data;
    }
  }
}

module.exports = SuccessResponse;
