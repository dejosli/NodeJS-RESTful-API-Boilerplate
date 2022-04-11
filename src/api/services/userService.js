// External module imports
const httpStatus = require('http-status');

// Internal module imports
const { User } = require('../models');
const { ErrorResponse } = require('../utils');
const errorMessages = require('../../config/error-messages');
const { cloudinaryUploader } = require('../lib/cloudinary-uploader');

// define upload folder for profile picture
const AVATAR_UPLOAD_FOLDER = 'avatar';

/**
 * Create a user
 * @param {object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  // construct new user object
  const newUser = { ...userBody };
  const { profilePicture } = newUser;

  // check if user object has profile picture
  if (profilePicture) {
    const options = {
      folder: AVATAR_UPLOAD_FOLDER,
      access_mode: 'authenticated',
      eager: [{ width: 90, height: 90, crop: 'thumb', gravity: 'face' }],
      eager_async: true,
    };
    // upload profile picture to cloudinary
    const result = await cloudinaryUploader.uploadSingleFile(
      profilePicture,
      options
    );
    // const result = await cloudinaryUploader.uploadSingleFileStream(profilePicture, options);
    newUser.profilePicture = result.secure_url;
  }

  // save user to db
  const user = await User.create(newUser);

  if (!user) {
    // remove profile picture from cloudinary
    if (newUser.profilePicture) {
      await cloudinaryUploader.deleteFile(newUser.profilePicture);
    }
    throw new ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      httpStatus[httpStatus.INTERNAL_SERVER_ERROR]
    );
  }

  return user;
};

/**
 * Get users
 * @param {object} query
 * @return {Promise<object[]>} an array of objects representing users
 */
const queryUsers = async (query) => {
  const filter =
    query.search && query.search !== undefined
      ? {
          $match: {
            $text: {
              $search: query.search,
              $caseSensitive: false,
              $diacriticSensitive: true,
            },
          },
        }
      : {
          $match: {},
        };

  const pipeline = [
    filter,
    {
      $project: {
        id: '$_id',
        _id: 0,
        name: 1,
        username: 1,
        email: 1,
        role: 1,
        profilePicture: 1,
        isEmailVerified: 1,
      },
    },
  ];

  const options = {
    ...query,
    sortBy: { name: query?.name, role: query?.role },
    countQuery: filter,
    meta: query.include_metadata,
  };

  return User.offsetPaginate(pipeline, options);
};

/**
 * Get user by id
 * @param {string} userId
 * @returns {Promise<User>}
 */
const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ErrorResponse(
      httpStatus.NOT_FOUND,
      errorMessages.USER_NOT_FOUND_ERR
    );
  }
  return user;
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ErrorResponse(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const user = await User.findByIdAndUpdate(userId, updateBody, { new: true });
  if (!user) {
    throw new ErrorResponse(
      httpStatus.NOT_FOUND,
      errorMessages.USER_UPDATE_ERR
    );
  }
  return user;
};

/**
 * Remove user by id
 * @param {string} userId
 * @return {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new ErrorResponse(
      httpStatus.NOT_FOUND,
      errorMessages.USER_DELETE_ERR
    );
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
