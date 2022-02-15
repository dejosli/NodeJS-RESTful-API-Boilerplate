// External module imports
const { body, param, query } = require('express-validator');

// Internal module imports
const {
  isUsernameTaken,
  isEmailTaken,
  isObjectId,
  isInRoles,
} = require('./customValidator');

const createUser = [
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
  body('role').custom(isInRoles).trim().escape(),
];

const getUser = [param('userId').custom(isObjectId)];

// Module exports
module.exports = {
  createUser,
  getUser,
};