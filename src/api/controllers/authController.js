// External module imports
require('module-alias/register');
const httpStatus = require('http-status');

// Internal module imports
const {
  SuccessResponse,
  sendTokenResponse,
  sendOtpResponse,
  common,
} = require('utils');
const {
  authService,
  userService,
  tokenService,
  emailService,
  otpService,
} = require('services');
const { Token } = require('models');
const { tokenTypes } = require('config/tokens');

const { asyncHandler } = common;

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
    const otpDoc = await otpService.getSecretKey({ user: user._id });
    return sendOtpResponse(res, user, otpDoc);
  }
  // generate and save tokens
  const tokens = await tokenService.generateAuthTokens(user._id);
  // send response
  return sendTokenResponse(
    res,
    user,
    tokens,
    httpStatus.OK,
    httpStatus[httpStatus.OK]
  );
});

/**
 * @desc Logout current user
 * @route DELETE /api/v1/auth/logout
 * @access Private
 */
const logout = asyncHandler(async (req, res, next) => {
  const { user, deviceId, cookies } = req;
  if (user) {
    await authService.logoutUserWithToken(user._id, deviceId);
  }
  if (user && cookies && cookies.tokens) {
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
  const { user, deviceId } = req.refreshTokenDoc;
  // delete old refreshToken
  await Token.deleteOneToken({ userId: user._id, deviceId });
  // re-generate new auth tokens
  const tokens = await tokenService.generateAuthTokens(user._id);
  // send response
  sendTokenResponse(
    res,
    null,
    tokens,
    httpStatus.OK,
    httpStatus[httpStatus.OK]
  );
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
  res
    .status(httpStatus.OK)
    .json(
      new SuccessResponse(
        httpStatus.OK,
        `Password reset link has been sent to: ${user.email}`
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
  const { _id: userId, name, email, isEmailVerified } = req.user;
  // if user email already verified
  if (isEmailVerified) {
    return res
      .status(httpStatus.OK)
      .json(new SuccessResponse(httpStatus.OK, 'Email already verified'));
  }
  // if verify email token already exists
  await Token.deleteOneToken({
    userId,
    type: tokenTypes.VERIFY_EMAIL,
  });
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(userId);
  // send verify token to client as email
  await emailService.sendVerificationEmail(email, name, verifyEmailToken);
  // send response to client
  res
    .status(httpStatus.OK)
    .json(
      new SuccessResponse(
        httpStatus.OK,
        `Email verification link has been sent to: ${email}`
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
  // generate and save tokens
  const tokens = await tokenService.generateAuthTokens(userId);
  // send response
  sendTokenResponse(
    res,
    null,
    tokens,
    httpStatus.OK,
    httpStatus[httpStatus.OK]
  );
});

/**
 * @desc Enable two factor authentication
 * @route POST /api/v1/auth/otp/send
 * @access Private
 */
const sendOtpCode = asyncHandler(async (req, res, next) => {
  const { enabled, send_otp: verificationMethod } = req.body;
  const { _id: userId, isTwoFactorAuthEnabled } = req.user;

  // check if user is already enabled 2FA
  if (enabled && isTwoFactorAuthEnabled) {
    return res
      .status(httpStatus.OK)
      .json(
        new SuccessResponse(
          httpStatus.OK,
          'Two factor authentication is already enabled'
        )
      );
  }

  // check if user is already disabled 2FA
  if (!enabled && !isTwoFactorAuthEnabled) {
    return res
      .status(httpStatus.OK)
      .json(
        new SuccessResponse(
          httpStatus.OK,
          'Two factor authentication is already disabled'
        )
      );
  }

  // To enable two factor authentication
  if (enabled) {
    await otpService.deleteOneSecretKey({ user: userId });
    const otpDoc = await otpService.generateOtpCode(
      req.user,
      verificationMethod
    );
    return sendOtpResponse(res, req.user, otpDoc);
  }

  // To disable two factor authentication
  await userService.updateUserById(userId, { isTwoFactorAuthEnabled: false });
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
const verifyOtpCode = asyncHandler(async (req, res, next) => {
  const { otp_id: otpId, otp_code: otpCode } = req.body;

  // find otp secret key and verify it against given otp code
  const otpDoc = await otpService.getSecretKey({ _id: otpId });
  otpService.verifyToken(otpCode, otpDoc.secretKey, 30, 1);

  // enable two factor authentication for the user
  await userService.updateUserById(otpDoc.user, {
    isTwoFactorAuthEnabled: true,
  });
  // update otp status as verified
  if (!otpDoc.verified) {
    await otpService.updateSecretKey({ _id: otpId }, { verified: true });
  }
  // generate auth tokens and save to db
  const tokens = await tokenService.generateAuthTokens(otpDoc.user);
  // send response
  sendTokenResponse(
    res,
    null,
    tokens,
    httpStatus.OK,
    httpStatus[httpStatus.OK]
  );
});

/**
 * @desc Resend two factor authentication code
 * @route POST /api/v1/auth/otp/resend
 * @access Public
 */
const resendOtpCode = asyncHandler(async (req, res, next) => {
  const { otp_id: otpId } = req.body;
  // find otp secret key
  const { user: userId, verificationMethod } = await otpService.getSecretKey({
    _id: otpId,
  });
  // delete old otp secret key
  await otpService.deleteOneSecretKey({
    _id: otpId,
  });
  const user = await userService.getUserById(userId);
  // generate new otp secret key and save
  const otpDoc = await otpService.generateOtpCode(user, verificationMethod);
  return sendOtpResponse(res, user, otpDoc);
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
  sendOtpCode,
  verifyOtpCode,
  resendOtpCode,
};
