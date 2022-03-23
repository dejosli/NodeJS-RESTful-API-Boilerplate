// External module imports
const express = require('express');

// Internal module imports
const { userController } = require('../../controllers');
const { userValidator, validate } = require('../../validations');
const {
  authorizeAccessToken,
} = require('../../middleware/authentication/auth');
const {
  authorizeUsersCreatePermission,
  authorizeUsersReadPermission,
  authorizeUsersUpdatePermission,
  authorizeUsersDeletePermission,
} = require('../../middleware/permissions/users.permission');
const profilePicUpload = require('../../middleware/users/profilePicUpload');

// init express router
const router = express.Router();

// mount routes
router
  .route('/')
  .get(
    [userValidator.getUsers, validate],
    authorizeAccessToken,
    authorizeUsersReadPermission,
    userController.getUsers
  )
  .post(
    profilePicUpload,
    [userValidator.createUser, validate],
    authorizeAccessToken,
    authorizeUsersCreatePermission,
    userController.createUser
  );
router
  .route('/:userId')
  .get(
    [userValidator.getUser, validate],
    authorizeAccessToken,
    authorizeUsersReadPermission,
    userController.getUser
  )
  .put(
    [userValidator.updateUser, validate],
    authorizeAccessToken,
    authorizeUsersUpdatePermission,
    userController.updateUser
  )
  .delete(
    [userValidator.deleteUser, validate],
    authorizeAccessToken,
    authorizeUsersDeletePermission,
    userController.deleteUser
  );

// Module exports
module.exports = router;
