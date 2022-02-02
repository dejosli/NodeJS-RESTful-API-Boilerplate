// External module imports
const httpStatus = require('http-status');

// Internal module imports
const SuccessResponse = require('../utils/SuccessResponse');
const sendTokenResponse = require('../utils/sendTokenResponse');
const asyncHandler = require('../middlewares/common/asyncHandler');
const { authService } = require('../services/index');

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

// Module exports
module.exports = {
  register,
  login,
};
