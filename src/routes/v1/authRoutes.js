// External module imports
const express = require('express');

// Internal module imports
const { authController } = require('../../controllers');
const { authValidator } = require('../../validations');
const validate = require('../../middlewares/validate');
const protect = require('../../middlewares/auth');
const refreshAuth = require('../../middlewares/refreshAuth');

const router = express.Router();

// mount routes
router.get('/me', protect, authController.getMe);
router.post(
  '/register',
  authValidator.register,
  validate,
  authController.register
);
router.post('/login', authValidator.login, validate, authController.login);
router.delete('/logout', protect, authController.logout);
router.get('/refresh-tokens', refreshAuth, authController.refreshTokens);
// router.post(
//   '/forgot-password',
//   protect,
//   authValidator.forgotPassword,
//   validate,
//   authController.forgotPassword
// );
// router.post(
//   '/reset-password',
//   protect,
//   authValidator.resetPassword,
//   validate,
//   authController.resetPassword
// );
// router.post(
//   '/send-verification-email',
//   protect,
//   authController.sendVerificationEmail
// );
// router.post(
//   '/verify-email',
//   protect,
//   authValidator.verifyEmail,
//   validate,
//   authController.verifyEmail
// );

// Module exports
module.exports = router;
