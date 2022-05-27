// Internal module imports
const { verificationMethods } = require('../../config/otps');
const { httpStatus, httpMessage } = require('../../config/custom-http-status');
const { otpService, emailService, messagingService } = require('../services');
const ErrorResponse = require('./ErrorResponse');
const SuccessResponse = require('./SuccessResponse');

const sendOtpResponse = async (res, user, otpDoc) => {
  const { secretKey, verificationMethod } = otpDoc;

  if (verificationMethod === verificationMethods.EMAIL) {
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
          `Authentication code sent via ${verificationMethods.EMAIL}`,
          { otp_id: otpDoc._id }
        )
      );
  }

  if (verificationMethod === verificationMethods.SMS) {
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
          `Authentication code sent via ${verificationMethods.SMS}`,
          { otp_id: otpDoc._id }
        )
      );
  }

  if (verificationMethod === verificationMethods.GOOGLE_AUTHENTICATOR) {
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
      new ErrorResponse(
        httpStatus.UNAUTHORIZED,
        httpMessage.OTP_UNKNOWN_VERIFICATION_METHOD_ERROR
      )
    );
};

// Module exports
module.exports = sendOtpResponse;
