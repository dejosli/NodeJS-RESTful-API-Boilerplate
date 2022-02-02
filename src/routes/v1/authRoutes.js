// External module imports
const express = require('express');

// Internal module imports
const { authController } = require('../../controllers/index');
const { authValidator } = require('../../validations/index');
const validate = require('../../middlewares/validate');

const router = express.Router();

// mount routes
router.post('/login', authValidator.login, validate, authController.login);
router.post(
  '/register',
  authValidator.register,
  validate,
  authController.register
);

// Module exports
module.exports = router;
