// External module imports
const express = require('express');

// Internal module imports
const { userValidator, validate } = require('../../validators');
const {
  authorizeUsersCreatePermission,
  authorizeUsersReadPermission,
  authorizeUsersUpdatePermission,
  authorizeUsersDeletePermission,
} = require('../../middleware/permissions/users.permission');
const profilePicUpload = require('../../middleware/users/profilePicUpload');
const {
  authorizeAccessToken,
} = require('../../middleware/authentication/auth');
const { userController } = require('../../controllers');

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
