// External module imports
require('module-alias/register');
const httpStatus = require('http-status');

// Internal module imports
const { serviceTypes } = require('config/otps');
const { otpService, emailService, messagingService } = require('services');
const SuccessResponse = require('./SuccessResponse');
const ErrorResponse = require('./ErrorResponse');

const sendOtpResponse = async (res, user, otpDoc) => {
  const { secretKey, serviceType } = otpDoc;

  if (serviceType === serviceTypes.EMAIL) {
    // generate time-based token
    const token = otpService.getToken(secretKey);
    // calculate otp token remaining time
    // const remaining = 30 - Math.floor((new Date().getTime() / 1000) % 30);
    // send token via email
    await emailService.sendOtpEmail(user.email, user.name, token);
    return res
      .status(httpStatus.OK)
      .json(
        new SuccessResponse(
          httpStatus.OK,
          `Authentication code sent via ${serviceTypes.EMAIL}`,
          { otp_id: otpDoc._id }
        )
      );
  }

  if (serviceType === serviceTypes.SMS) {
    // generate time-based token
    const token = otpService.getToken(secretKey);
    // calculate otp token remaining time
    // const remaining = 30 - Math.floor((new Date().getTime() / 1000) % 30);
    // send token via sms
    await messagingService.sendOtpSMS(user.phoneNumber, token);
    return res
      .status(httpStatus.OK)
      .json(
        new SuccessResponse(
          httpStatus.OK,
          `Authentication code sent via ${serviceTypes.SMS}`,
          { otp_id: otpDoc._id }
        )
      );
  }

  if (serviceType === serviceTypes.GOOGLE_AUTHENTICATOR) {
    // generate qrcode url
    const url = otpService.generateQRCodeURL(secretKey, user.email);
    // send qrcode url
    return res.status(httpStatus.OK).json(
      new SuccessResponse(
        httpStatus.OK,
        `Authentication QR code url generated`,
        {
          otp_id: otpDoc._id,
          otpauth_url: url,
        }
      )
    );
  }

  // default response
  return res
    .status(httpStatus.UNAUTHORIZED)
    .json(
      new ErrorResponse(httpStatus.UNAUTHORIZED, 'Unknown error occurred!')
    );
};

// Module exports
module.exports = sendOtpResponse;
