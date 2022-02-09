// External module imports
const express = require('express');

// Internal module imports
const validate = require('../../middlewares/validate');
const { authController } = require('../../controllers');
const { authValidator } = require('../../validations');
const {
  authorizeAccessToken,
  authorizeRefreshToken,
  authorizeResetPasswordToken,
} = require('../../middlewares/auth');
const {
  authorizeUsersReadPermission,
} = require('../../middlewares/permissions/users.permission');

const router = express.Router();

// mount routes
router.get(
  '/user/:userId',
  authValidator.profile,
  validate,
  authorizeAccessToken,
  authorizeUsersReadPermission,
  authController.profile
);
router.post(
  '/register',
  authValidator.register,
  validate,
  authController.register
);
router.post('/login', authValidator.login, validate, authController.login);
router.delete('/logout', authorizeAccessToken, authController.logout);
router.get(
  '/refresh-tokens',
  authorizeRefreshToken,
  authController.refreshTokens
);
router.post(
  '/forgot-password',
  authValidator.forgotPassword,
  validate,
  authController.forgotPassword
);
router.post(
  '/reset-password',
  authValidator.resetPassword,
  validate,
  authorizeResetPasswordToken,
  authController.resetPassword
);

// router.post(
//   '/send-verification-email',
//   authorizeAccessToken,
//   authController.sendVerificationEmail
// );
// router.post(
//   '/verify-email',
//   authorizeAccessToken,
//   authValidator.verifyEmail,
//   validate,
//   authController.verifyEmail
// );

// Module exports
module.exports = router;
