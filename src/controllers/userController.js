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
  const { name, username, email, password, role } = req.body;
  const newUser = { name, username, email, password, role };
  const user = await userService.createUser(newUser);
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
  // eslint-disable-next-line camelcase
  const { include_meta: meta } = req.query;
  const { docs: users, ...paginator } = await userService.queryUsers(req.query);

  let prevPage;
  let nextPage;

  const currentPage = `${req.baseUrl}?page=${paginator.page}&limit=${paginator.limit}&include_meta=${meta}`;

  if (paginator.hasPrevPage) {
    prevPage = `${req.baseUrl}?page=${paginator.prevPage}&limit=${paginator.limit}&include_meta=${meta}`;
  }
  if (paginator.hasNextPage) {
    nextPage = `${req.baseUrl}?page=${paginator.nextPage}&limit=${paginator.limit}&include_meta=${meta}`;
  }
  const links = { prevPage, currentPage, nextPage };

  // set response headers
  res.header('Links', new URLSearchParams(links));
  res.header('totalPages', paginator.totalPages);
  // send response
  res.status(httpStatus.OK).json(
    new SuccessResponse(
      httpStatus.OK,
      httpStatus[httpStatus.OK],
      {
        users,
      },
      { ...paginator, links }
    )
  );
});

/**
 * @desc Update user by id
 * @route PUT /api/v1/users/:userId
 * @access Private
 */
const updateUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const updateBody = {
    name,
    email,
    password,
    role,
  };
  const user = await userService.updateUserById(req.params.userId, updateBody);
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
