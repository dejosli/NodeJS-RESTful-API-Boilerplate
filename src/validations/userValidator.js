// External module imports
const { body, param, query } = require('express-validator');

// Internal module imports
const {
  isUsernameTaken,
  isEmailTaken,
  isObjectId,
  isInRoles,
} = require('./customValidator');

const role = body('role').optional().custom(isInRoles).trim().escape();

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
    .custom((value) => !value.includes(' '))
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
  role,
];

const getUsers = [
  query('search').optional().notEmpty().trim().escape(),
  query('name').optional().notEmpty().isIn(['asc', 'desc']).trim().escape(),
  query('role').optional().notEmpty().isIn(['asc', 'desc']).trim().escape(),
  query('offset').optional().isInt({ min: 0, allow_leading_zeroes: false }),
  query('page').optional().isInt({ gt: 0, allow_leading_zeroes: false }),
  query('limit')
    .optional()
    .isInt({ min: 2, max: 10, allow_leading_zeroes: false }),
  query('include_meta').optional().isBoolean(),
];

const getUser = param('userId').custom(isObjectId);

const updateUser = [
  param('userId').custom(isObjectId),
  body('name')
    .optional()
    .isLength({ min: 1 })
    .withMessage('Name is required')
    .isAlpha('en-US', { ignore: ' -' })
    .withMessage('Name must not contain anything other than alphabet')
    .trim()
    .escape(),
  body('email')
    .optional()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail()
    .trim()
    .escape()
    .custom(isEmailTaken),
  body('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('Password is required and must be at least 8 characters long')
    .isStrongPassword()
    .withMessage(
      'Password should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol'
    ),
  role,
];

const deleteUser = param('userId').custom(isObjectId);

// Module exports
module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
