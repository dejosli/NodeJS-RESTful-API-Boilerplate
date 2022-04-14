// External module imports
const httpStatus = require('http-status');

// define custom http messages
const httpMessage = {
  // basic http messages
  [httpStatus.OK]: 'Everything worked as expected.',
  [httpStatus.CREATED]: 'Resource created successfully.',
  [httpStatus.BAD_REQUEST]:
    'The request was unacceptable, often due to invalid JSON format.',
  [httpStatus.NOT_FOUND]: "The requested resource doesn't exist.",
  [httpStatus.UNAUTHORIZED]: 'No valid token provided.',
  [httpStatus.FORBIDDEN]:
    "Access denied, you don't have permission to access on this server",
  [httpStatus.UNPROCESSABLE_ENTITY]:
    'The request unprocessable, often due to invalid parameters.',
  [httpStatus.INTERNAL_SERVER_ERROR]: 'The service is temporarily unavailable.',
  [httpStatus.SERVICE_UNAVAILABLE]: 'The service is currently unavailable.',

  // error messages
  OTP_VERIFICATION_ERROR: 'Failed to verify otp token',
  OAUTH_VERIFICATION_ERROR:
    'You have previously signed up with a different login method',

  USER_LOGIN_ERROR: 'Wrong email or password',
  USER_PASSWORD_RESET_ERROR: 'Failed to reset password',
  USER_EMAIL_VERIFICATION_ERROR: 'Failed to verify email',

  CLOUDINARY_FILE_UPLOAD_ERROR: 'Failed to upload file in cloudinary',
  CLOUDINARY_FILE_UPDATE_ERROR: 'Failed to update file in cloudinary',
  CLOUDINARY_FILE_DELETE_ERROR: 'Failed to delete file in cloudinary',
};

// Module exports
module.exports = {
  httpStatus,
  httpMessage,
};
