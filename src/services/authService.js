const httpStatus = require('http-status');
const { User } = require('../models/index');
const ErrorResponse = require('../utils/ErrorResponse');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  const user = await User.create(userBody);
  return user;
};

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  // find user in database
  const user = await User.findOne({ email }).select('+password');
  // if user not found
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ErrorResponse(httpStatus.UNAUTHORIZED, 'Wrong email or password');
  }
  return user;
};

module.exports = {
  createUser,
  loginUserWithEmailAndPassword,
};
