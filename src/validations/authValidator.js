const { check } = require('express-validator');
const { User } = require('../models/index');

// if email exists
const checkEmailExists = (value) => {
  return User.findByEmail(value).then((user) => {
    if (user) {
      return Promise.reject(new Error('Email already exists'));
    }
  });
};

const register = [
  check('username')
    .isLength({ min: 1 })
    .withMessage('Username is required')
    .isAlpha('en-US', { ignore: ' -' })
    .withMessage('Name must not contain anything other than alphabet')
    .trim()
    .escape(),
  check('email')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(checkEmailExists)
    .normalizeEmail()
    .trim()
    .escape(),
  check('password')
    .isLength({ min: 8 })
    .withMessage('Password is required and must be at least 8 characters long')
    .isStrongPassword()
    .withMessage(
      'Password should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol'
    ),
];

const login = [
  check('email')
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail()
    .trim()
    .escape(),
  check('password')
    .isLength({ min: 8 })
    .withMessage('Password is required and must be at least 8 characters long')
    .isStrongPassword()
    .withMessage(
      'Password should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol'
    ),
];

module.exports = {
  register,
  login,
};
