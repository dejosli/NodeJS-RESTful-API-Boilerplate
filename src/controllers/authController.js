// External module imports
const httpStatus = require('http-status');

// Internal module imports
const asyncHandler = require('../middlewares/common/asyncHandler');
const { SuccessResponse, sendTokenResponse } = require('../utils');
const { authService, tokenService, emailService } = require('../services');

/**
 * @desc Get current logged in user
 * @route GET /api/v1/auth/me
 * @access Private
 */
const profile = asyncHandler(async (req, res, next) => {
  return res.status(httpStatus.OK).json(
    new SuccessResponse(httpStatus.OK, httpStatus[httpStatus.OK], {
      user: req.user,
    })
  );
});

/**
 * @desc Register user
 * @route POST /api/v1/auth/register
 * @access Public
 */
const register = asyncHandler(async (req, res, next) => {
  // create a new user
  const user = await authService.createUser(req.body);
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
  // get user from DB
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  // generate and save tokens
  const tokens = await tokenService.generateAuthTokens(user._id);
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

// Module exports
module.exports = {
  profile,
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
};
