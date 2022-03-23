// External module imports
const express = require('express');
const passport = require('passport');

// Internal module imports
const { authController } = require('../../controllers');
const { authValidator, validate } = require('../../validations');
const {
  authorizeAccessToken,
  authorizeRefreshToken,
  authorizeResetPasswordToken,
  authorizeVerifyEmailToken,
} = require('../../middleware/authentication/auth');
const {
  authorizeGoogleOAuth,
  authorizeFacebookOAuth,
} = require('../../middleware/authentication/oauth');

// init express router
const router = express.Router();

// mount routes
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
router.post(
  '/send-verification-email',
  authorizeAccessToken,
  authController.sendVerificationEmail
);
router.post(
  '/verify-email',
  authValidator.verifyEmail,
  validate,
  authorizeVerifyEmailToken,
  authController.verifyEmail
);
// mount google oauth routes
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);
router.get('/google/callback', authorizeGoogleOAuth, authController.oauthLogin);
// mount facebook oauth routes
router.get(
  '/facebook',
  passport.authenticate('facebook', {
    scope: ['email'],
  })
);
router.get(
  '/facebook/callback',
  authorizeFacebookOAuth,
  authController.oauthLogin
);

// Module exports
module.exports = router;
