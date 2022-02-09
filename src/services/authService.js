// External module imports
const httpStatus = require('http-status');

// Internal module imports
const { User, Token } = require('../models/index');
const { ErrorResponse } = require('../utils');
const { tokenTypes } = require('../config/tokens');

/**
 * Get user by id
 * @param {string} userId
 * @returns {Promise<User>}
 */
const getUserById = async (userId) => {
  const user = await User.findById(userId);

  return user;
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ErrorResponse(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ErrorResponse(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

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
  // if refresh_token already exists
  await Token.deleteToken({ userId: user._id });
  return user;
};

/**
 * Logout user via refresh token
 * @param {ObjectId} userId
 * @returns {Promise<Token>}
 */
const logoutUserWithToken = async (userId) => {
  // find and delete refresh_token from DB
  const refreshTokenDoc = await Token.deleteToken({ userId });
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

/**
 * Process request for forgot password
 * @param {string} email
 * @returns {Promise<User>}
 */
const requestPasswordReset = async (email) => {
  const user = await User.findByEmail(email);
  if (!user) {
    throw new ErrorResponse(httpStatus.NOT_FOUND, 'User not found');
  }
  // if resetToken already exists
  await Token.deleteToken({
    userId: user._id,
    type: tokenTypes.RESET_PASSWORD,
  });
  return user;
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (userId, newPassword) => {
  await updateUserById(userId, { password: newPassword });
  // remove resetPasswordToken from DB
  await Token.deleteToken({
    userId,
    type: tokenTypes.RESET_PASSWORD,
  });
};

// Module exports
module.exports = {
  createUser,
  getUserById,
  updateUserById,
  loginUserWithEmailAndPassword,
  logoutUserWithToken,
  logoutUserWithCookie,
  requestPasswordReset,
  resetPassword,
};
