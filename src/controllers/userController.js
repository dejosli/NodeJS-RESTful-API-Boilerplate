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
  return res.status(httpStatus.OK).json(
    new SuccessResponse(httpStatus.OK, httpStatus[httpStatus.OK], {
      user: req.user,
    })
  );
});

const getUsers = asyncHandler(async (req, res, next) => {});

// Module exports
module.exports = {
  createUser,
  getUser,
  getUsers,
};
