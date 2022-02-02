const httpStatus = require('http-status');
const SuccessResponse = require('../utils/SuccessResponse');
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
  // create jwt token
  const token = user.getSignedJwtToken();
  // send jwt token to user
  res.status(httpStatus.OK).json(
    new SuccessResponse(httpStatus.OK, 'You logged in successfully', {
      token,
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
  // create jwt token
  const token = user.getSignedJwtToken();
  // send jwt token to user
  res.status(httpStatus.CREATED).json(
    new SuccessResponse(httpStatus.CREATED, 'User created successfully', {
      token,
    })
  );
});

module.exports = {
  register,
  login,
};
