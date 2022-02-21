// External module imports
const express = require('express');

// Internal module imports
const validate = require('../../middlewares/validate');
const { userController } = require('../../controllers');
const { userValidator } = require('../../validations');
const { authorizeAccessToken } = require('../../middlewares/auth');
const {
  authorizeUsersCreatePermission,
  authorizeUsersReadPermission,
  authorizeUsersUpdatePermission,
  authorizeUsersDeletePermission,
} = require('../../middlewares/permissions/users.permission');

// init express router
const router = express.Router();

// mount routes
router
  .route('/')
  .get(
    userValidator.getUsers,
    validate,
    authorizeAccessToken,
    authorizeUsersReadPermission,
    userController.getUsers
  )
  .post(
    userValidator.createUser,
    validate,
    authorizeAccessToken,
    authorizeUsersCreatePermission,
    userController.createUser
  );
router
  .route('/:userId')
  .get(
    userValidator.getUser,
    validate,
    authorizeAccessToken,
    authorizeUsersReadPermission,
    userController.getUser
  )
  .put(
    userValidator.updateUser,
    validate,
    authorizeAccessToken,
    authorizeUsersUpdatePermission,
    userController.updateUser
  )
  .delete(
    userValidator.deleteUser,
    validate,
    authorizeAccessToken,
    authorizeUsersDeletePermission,
    userController.deleteUser
  );

// Module exports
module.exports = router;
