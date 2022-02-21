// External module imports
const httpStatus = require('http-status');

// Internal module imports
const asyncHandler = require('../middlewares/common/asyncHandler');
const { SuccessResponse } = require('../utils');
const { userService } = require('../services');

/**
 * @desc Create user
 * @route POST /api/v1/users
 * @access Private
 */
const createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).json(
    new SuccessResponse(httpStatus.OK, httpStatus[httpStatus.OK], {
      user,
    })
  );
});

/**
 * @desc Get user by id
 * @route GET /api/v1/users/:userId
 * @access Private
 */
const getUser = asyncHandler(async (req, res, next) => {
  res.status(httpStatus.OK).json(
    new SuccessResponse(httpStatus.OK, httpStatus[httpStatus.OK], {
      user: req.user,
    })
  );
});

/**
 * @desc Get all users
 * @route GET /api/v1/users
 * @access Private
 */
const getUsers = asyncHandler(async (req, res, next) => {
  const users = await userService.queryUsers({});
  res.status(httpStatus.OK).json(
    new SuccessResponse(httpStatus.OK, httpStatus[httpStatus.OK], {
      users,
    })
  );
});

/**
 * @desc Update user by id
 * @route PUT /api/v1/users/:userId
 * @access Private
 */
const updateUser = asyncHandler(async (req, res, next) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.status(httpStatus.OK).json(
    new SuccessResponse(httpStatus.OK, httpStatus[httpStatus.OK], {
      user,
    })
  );
});

/**
 * @desc Delete user by id
 * @route DELETE /api/v1/users/:userId
 * @access Private
 */
const deleteUser = asyncHandler(async (req, res, next) => {
  await userService.deleteUserById(req.params.userId, req.body);
  res
    .status(httpStatus.NO_CONTENT)
    .json(new SuccessResponse(httpStatus.NO_CONTENT));
});

// Module exports
module.exports = {
  createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
};
