// External module imports
const httpStatus = require('http-status');

// Internal module imports
const asyncHandler = require('../middleware/common/asyncHandler');
const {
  SuccessResponse,
  ErrorResponse,
  sendTokenResponse,
  sendOtpResponse,
} = require('../utils');
const {
  authService,
  userService,
  tokenService,
  emailService,
  otpService,
} = require('../services');
const { Token } = require('../models');

/**
 * @desc Register user
 * @route POST /api/v1/auth/register
 * @access Public
 */
const register = asyncHandler(async (req, res, next) => {
  const { name, username, email, password, phoneNumber, role } = req.body;
  // define user object
  const userBody = {
    name,
    username,
    email,
    password,
    phoneNumber,
    role,
    profilePicture: req?.file?.path,
  };
  // create a new user
  const user = await userService.createUser(userBody);
  // generate access and refresh token
  const tokens = await tokenService.generateAuthTokens(user._id);
  // send response
  sendTokenResponse(
    res,
    user,
    tokens,
    httpStatus.CREATED,
    'User created successfully'
  );
});

/**
 * @desc Login user
 * @route POST /api/v1/auth/login
 * @access Public
 */
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  // fetch user from DB
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  // check whether user has 2FA enabled or not
  if (user.isTwoFactorAuthEnabled) {
    const otpDoc = await otpService.findSecretKey({ user: user._id });
    return sendOtpResponse(res, user, otpDoc);
  }
  // generate and save tokens
  const tokens = await tokenService.generateAuthTokens(user._id);
  // send response
  return sendTokenResponse(
    res,
    null,
    tokens,
    httpStatus.OK,
    'You logged in successfully'
  );
});

/**
 * @desc Logout current user
 * @route DELETE /api/v1/auth/logout
 * @access Private
 */
const logout = asyncHandler(async (req, res, next) => {
  if (req.user) {
    await authService.logoutUserWithToken(req.user._id);
  }
  if (req.user && req.cookies && req.cookies.tokens) {
    await authService.logoutUserWithCookie(res, 'tokens');
  }
  // send response to client
  res
    .status(httpStatus.NO_CONTENT)
    .json(new SuccessResponse(httpStatus.NO_CONTENT));
});

/**
 * @desc Logout current user
 * @route GET /api/v1/auth/refresh-tokens
 * @access Private
 */
const refreshTokens = asyncHandler(async (req, res, next) => {
  // re-generate(access_token) auth tokens
  const tokens = await tokenService.refreshAuthTokens(req.refreshTokenDoc);
  // send response
  sendTokenResponse(res, null, tokens, httpStatus.OK, 'Access token response');
});

/**
 * @desc Forgot password
 * @route POST /api/v1/auth/forgot-password
 * @access Public
 */
const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await authService.requestPasswordReset(req.body.email);
  const resetPasswordToken = await tokenService.generateResetPasswordToken(
    user._id
  );
  // email resetToken to client
  await emailService.sendResetPasswordEmail(
    user.email,
    user.name,
    resetPasswordToken
  );
  // send response to client
  res.status(httpStatus.OK).json(
    new SuccessResponse(
      httpStatus.OK,
      `Password reset link has been sent to: ${user.email}`,
      {
        resetPasswordToken,
      }
    )
  );
});

/**
 * @desc Reset password
 * @route POST /api/v1/auth/reset-password
 * @access Private
 */
const resetPassword = asyncHandler(async (req, res, next) => {
  const { user } = req.resetPasswordTokenDoc;
  const { password } = req.body;
  await authService.resetPassword(user._id, password);
  // confirmation email to client
  await emailService.sendEmail(
    user.email,
    'Reset Password Confirmation',
    'Password changed successful'
  );
  // send response to client
  res
    .status(httpStatus.OK)
    .json(
      new SuccessResponse(
        httpStatus.OK,
        'Password changed successful. Please check your email'
      )
    );
});

/**
 * @desc Send verification email
 * @route POST /api/v1/auth/send-verify-email
 * @access Public
 */
const sendVerificationEmail = asyncHandler(async (req, res, next) => {
  // if current user email already verified
  if (req.user.isEmailVerified) {
    return res
      .status(httpStatus.OK)
      .json(new SuccessResponse(httpStatus.OK, 'Email already verified'));
  }
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(
    req.user._id
  );
  // email resetToken to client
  await emailService.sendVerificationEmail(
    req.user.email,
    req.user.name,
    verifyEmailToken
  );
  // send response to client
  res.status(httpStatus.OK).json(
    new SuccessResponse(
      httpStatus.OK,
      `Email verification link has been sent to: ${req.user.email}`,
      {
        verifyEmailToken,
      }
    )
  );
});

/**
 * @desc Verify email
 * @route POST /api/v1/auth/verify-email
 * @access Private
 */
const verifyEmail = asyncHandler(async (req, res, next) => {
  const { user } = req.verifyEmailTokenDoc;
  await authService.verifyEmail(user._id);
  // confirmation email to client
  await emailService.sendEmail(
    user.email,
    'Email Verification Confirm',
    'Email verification successful'
  );
  // send response to client
  res
    .status(httpStatus.OK)
    .json(
      new SuccessResponse(
        httpStatus.OK,
        'Email verification successful. Please check your email'
      )
    );
});

/**
 * @desc Login user for OAuth 2.0
 * @route GET /api/v1/auth/<provider>/callback
 * @access Public
 */
const oauthLogin = asyncHandler(async (req, res, next) => {
  const { _id: userId } = req.user;
  // if refresh_token already exists
  await Token.deleteOneToken({ userId });
  // generate and save tokens
  const tokens = await tokenService.generateAuthTokens(req.user._id);
  // send response
  sendTokenResponse(
    res,
    null,
    tokens,
    httpStatus.OK,
    'You logged in successfully'
  );
});

/**
 * @desc Enable two factor authentication
 * @route POST /api/v1/auth/otp/send
 * @access Private
 */
const enable2FA = asyncHandler(async (req, res, next) => {
  const { enabled, send_otp: serviceType } = req.body;
  const { _id: userId, email } = req.user;

  if (enabled) {
    await otpService.deleteOneSecretKey({ user: userId });
    const { secretKey } = await otpService.generateSecretKey(email);
    const otpDoc = await otpService.saveSecretKey(
      secretKey,
      userId,
      false,
      serviceType
    );
    return sendOtpResponse(res, req.user, otpDoc);
  }

  // disable two factor authentication
  await userService.updateUserById(userId, { isTwoFactorAuthEnabled: false });
  // find and delete otp instance
  await otpService.deleteOneSecretKey({ user: userId });
  // send response
  return res
    .status(httpStatus.OK)
    .json(
      new SuccessResponse(httpStatus.OK, 'Two factor authentication disabled')
    );
});

/**
 * @desc Verify two factor authentication code
 * @route POST /api/v1/auth/otp/verify
 * @access Public
 */
const verify2FA = asyncHandler(async (req, res, next) => {
  const { otp_id: otpId, otp_code: otpCode } = req.body;
  const otpDoc = await otpService.findSecretKey({ _id: otpId });
  const verified = otpService.verifyOTP(otpCode, otpDoc.secretKey, 30, 1);

  if (verified) {
    // enable two factor authentication for the user
    await userService.updateUserById(otpDoc.user, {
      isTwoFactorAuthEnabled: true,
    });
    // update otp status
    await otpService.updateSecretKey({ _id: otpId }, { verified: true });
    // if refresh_token already exists
    await Token.deleteOneToken({ userId: otpDoc.user });
    // generate and save tokens
    const tokens = await tokenService.generateAuthTokens(otpDoc.user);
    // send response
    return sendTokenResponse(
      res,
      null,
      tokens,
      httpStatus.OK,
      'You logged in successfully'
    );
  }
  // send response
  throw new ErrorResponse(httpStatus.UNAUTHORIZED, 'OTP verification failed!');
});

/**
 * @desc Resend two factor authentication code
 * @route POST /api/v1/auth/otp/resend
 * @access Public
 */
const resend2FA = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true });
});

// Module exports
module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  oauthLogin,
  enable2FA,
  verify2FA,
  resend2FA,
};
