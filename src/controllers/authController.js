// External module imports
const httpStatus = require('http-status');

// Internal module imports
const asyncHandler = require('../middlewares/common/asyncHandler');
const { SuccessResponse, sendTokenResponse } = require('../utils');
const { authService, tokenService } = require('../services');

/**
 * @desc Get current logged in user
 * @route GET /api/v1/auth/me
 * @access Private
 */
const getMe = (req, res, next) => {
  res.status(httpStatus.OK).json(
    new SuccessResponse(httpStatus.OK, httpStatus[httpStatus.OK], {
      user: req.user,
    })
  );
};

/**
 * @desc Register user
 * @route POST /api/v1/auth/register
 * @access Public
 */
const register = asyncHandler(async (req, res, next) => {
  // create a new user
  const user = await authService.createUser(req.body);
  // generate access and refresh token
  const tokens = await tokenService.generateAuthTokens(user);
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
  const tokens = await tokenService.generateAuthTokens(user);
  // send response
  sendTokenResponse(
    res,
    user,
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

// Module exports
module.exports = {
  getMe,
  register,
  login,
  logout,
};
