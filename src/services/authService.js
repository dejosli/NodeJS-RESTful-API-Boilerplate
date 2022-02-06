// External module imports
const httpStatus = require('http-status');

// Internal module imports
const { User, Token } = require('../models/index');
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

/**
 * Get a user
 * @param {string} userId
 * @returns {Promise<User>}
 */
const getUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ErrorResponse(
      httpStatus.NOT_FOUND,
      httpStatus[httpStatus.NOT_FOUND]
    );
  }
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
  // if token already exists
  await Token.deleteToken(user._id);
  return user;
};

/**
 * Logout user via refresh token
 * @param {ObjectId} userId
 * @returns {Promise<Token>}
 */
const logoutUserWithToken = async (userId) => {
  // find and delete refresh_token from DB
  const refreshTokenDoc = await Token.deleteToken(userId);
  if (!refreshTokenDoc) {
    throw new ErrorResponse(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
  return refreshTokenDoc;
};

/**
 * Logout user via cookie
 * @param {Object} res
 * @param {string} cookieName
 * @returns {Promise<Response>}
 */
const logoutUserWithCookie = async (res, cookieName) => {
  return res.clearCookie(cookieName);
};

// Module exports
module.exports = {
  createUser,
  getUser,
  loginUserWithEmailAndPassword,
  logoutUserWithToken,
  logoutUserWithCookie,
};
