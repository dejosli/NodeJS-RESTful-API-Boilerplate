// External module imports
const express = require('express');

// Internal module imports
const { authController } = require('../../controllers/index');
const { authValidator } = require('../../validations/index');
const validate = require('../../middlewares/validate');
const { protect } = require('../../middlewares/auth');

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

// Module exports
module.exports = router;
