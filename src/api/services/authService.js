// External module imports
require('module-alias/register');
const httpStatus = require('http-status');

// Internal module imports
const { User, Token } = require('models');
const { ErrorResponse } = require('utils');
const { tokenTypes } = require('config/tokens');
const errorMessages = require('config/error-messages');
const { updateUserById } = require('./userService');

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
    throw new ErrorResponse(
      httpStatus.UNAUTHORIZED,
      errorMessages.USER_LOGIN_ERR
    );
  }
  return user;
};

/**
 * Logout user via refresh token
 * @param {ObjectId} userId
 * @param {ObjectId} deviceId
 * @returns {Promise<Token>}
 */
const logoutUserWithToken = async (userId, deviceId) => {
  // find and delete refreshToken from db
  const refreshTokenDoc = await Token.deleteOneToken({ userId, deviceId });
  if (!refreshTokenDoc) {
    throw new ErrorResponse(
      httpStatus.UNAUTHORIZED,
      errorMessages.USER_UNAUTHORIZED_ERR
    );
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
 * Process request for reset password
 * @param {string} email
 * @returns {Promise<User>}
 */
const requestPasswordReset = async (email) => {
  const user = await User.findByEmail(email);
  if (!user) {
    throw new ErrorResponse(
      httpStatus.NOT_FOUND,
      errorMessages.USER_NOT_FOUND_ERR
    );
  }
  // if resetToken already exists
  await Token.deleteOneToken({
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
  try {
    // update user password
    await updateUserById(userId, { password: newPassword });
    // remove all tokens of user from db
    await Token.deleteMany({ user: userId });
  } catch (err) {
    throw new ErrorResponse(
      httpStatus.UNAUTHORIZED,
      errorMessages.USER_PASSWORD_RESET_ERR
    );
  }
};

/**
 * Verify email
 * @param {ObjectId} userId
 * @returns {Promise}
 */
const verifyEmail = async (userId) => {
  try {
    await updateUserById(userId, { isEmailVerified: true });
    // remove verifyEmailToken from db
    await Token.deleteManyToken({
      userId,
      type: tokenTypes.VERIFY_EMAIL,
    });
  } catch (err) {
    throw new ErrorResponse(
      httpStatus.UNAUTHORIZED,
      errorMessages.USER_EMAIL_VERIFICATION_ERR
    );
  }
};

// Module exports
module.exports = {
  loginUserWithEmailAndPassword,
  logoutUserWithToken,
  logoutUserWithCookie,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
};
