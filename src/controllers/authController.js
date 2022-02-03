// External module imports
const httpStatus = require('http-status');

// Internal module imports
const SuccessResponse = require('../utils/SuccessResponse');
const sendTokenResponse = require('../utils/sendTokenResponse');
const asyncHandler = require('../middlewares/common/asyncHandler');
const { authService } = require('../services/index');

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
  // send response
  sendTokenResponse(res, user, httpStatus.CREATED, 'User created successfully');
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
  // send response
  sendTokenResponse(res, user, httpStatus.OK, 'You logged in successfully');
});

/**
 * @desc Logout current user
 * @route DELETE /api/v1/auth/logout
 * @access Private
 */
const logout = asyncHandler(async (req, res, next) => {
  if (req.user && req.cookies && req.cookies.token) {
    return res
      .status(httpStatus.OK)
      .clearCookie('token')
      .json(new SuccessResponse(httpStatus.OK, 'You logged out successfully'));
  }
  res
    .status(httpStatus.UNAUTHORIZED)
    .json(
      new SuccessResponse(
        httpStatus.UNAUTHORIZED,
        httpStatus[httpStatus.UNAUTHORIZED]
      )
    );
});

// Module exports
module.exports = {
  getMe,
  register,
  login,
  logout,
};
