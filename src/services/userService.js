// External module imports
const httpStatus = require('http-status');

// Internal module imports
const { User } = require('../models');
const { ErrorResponse } = require('../utils');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  const user = await User.create(userBody);
  if (!user) {
    throw new ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      httpStatus[httpStatus.INTERNAL_SERVER_ERROR]
    );
  }
  return user;
};

const queryUsers = async (filter, options) => {
  const users = await User.find(filter);
  return users;
};

/**
 * Get user by id
 * @param {string} userId
 * @returns {Promise<User>}
 */
const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ErrorResponse(httpStatus.NOT_FOUND, 'User not found');
  }
  return user;
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ErrorResponse(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const user = await User.findByIdAndUpdate(userId, updateBody, { new: true });
  if (!user) {
    throw new ErrorResponse(httpStatus.NOT_FOUND, 'User update failed');
  }
  return user;
};

const deleteUserById = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new ErrorResponse(httpStatus.NOT_FOUND, 'User deletion failed');
  }
  return user;
};

// Module exports
module.exports = {
  createUser,
  queryUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
