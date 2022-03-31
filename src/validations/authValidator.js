// External module imports
const { body, query } = require('express-validator');

// Internal module imports
const {
  isUsernameTaken,
  isEmailTaken,
  isInRoles,
  is2faEnabled,
} = require('./customValidator');

const login = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail()
    .trim()
    .escape(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password is required and must be at least 8 characters long')
    .isStrongPassword()
    .withMessage(
      'Password should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol'
    ),
];

const register = [
  body('name')
    .isLength({ min: 1 })
    .withMessage('Name is required')
    .isAlpha('en-US', { ignore: ' -' })
    .withMessage('Name must not contain anything other than alphabet')
    .trim()
    .escape(),
  body('username')
    .isLength({ min: 1 })
    .withMessage('Username is required')
    .custom((username) => !username.includes(' '))
    .withMessage('No spaces are allowed in the username')
    .isAlphanumeric('en-US', { ignore: ' -' })
    .withMessage('Username must not contain anything other than alphabet')
    .trim()
    .escape()
    .custom(isUsernameTaken),
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail()
    .trim()
    .escape()
    .custom(isEmailTaken),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password is required and must be at least 8 characters long')
    .isStrongPassword()
    .withMessage(
      'Password should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol'
    ),
  body('phoneNumber')
    .notEmpty()
    .withMessage('Phone number is required')
    .isMobilePhone(['en-US', { strictMode: true }]),
  body('role').optional().custom(isInRoles).trim().escape(),
];

const forgotPassword = body('email')
  .notEmpty()
  .withMessage('Email is required')
  .isEmail()
  .withMessage('Invalid email address')
  .normalizeEmail()
  .trim()
  .escape();

const resetPassword = [
  query('token')
    .notEmpty()
    .withMessage('Token is required')
    .isJWT()
    .withMessage('Invalid token'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password is required and must be at least 8 characters long')
    .isStrongPassword()
    .withMessage(
      'Password should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol'
    ),
];

const verifyEmail = query('token')
  .notEmpty()
  .withMessage('Token is required')
  .isJWT()
  .withMessage('Invalid token');

// validators for two factor authentication

const enable2FA = [
  body('enabled').isBoolean().withMessage('A boolean value must be provided'),
  body('send_otp').custom(is2faEnabled),
];

const verify2FA = [
  body('otp_id').notEmpty().withMessage('OTP id is missing').isMongoId(),
  body('otp_code').notEmpty().withMessage('OTP code is missing'),
];

const resend2FA = body('otp_id').notEmpty().withMessage('OTP id is missing');

// Module exports
module.exports = {
  login,
  register,
  forgotPassword,
  resetPassword,
  verifyEmail,
  enable2FA,
  verify2FA,
  resend2FA,
};
