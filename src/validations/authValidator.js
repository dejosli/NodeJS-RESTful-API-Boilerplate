// External module imports
const { check, param } = require('express-validator');
const mongoose = require('mongoose');

// Internal module imports
const { User } = require('../models');
const { roles } = require('../config/roles');

// if email already exists
const isUsernameTaken = (username) => {
  return User.findByUsername(username).then((user) => {
    if (user) {
      return Promise.reject(new Error('Username already exists'));
    }
  });
};

// if email already exists
const isEmailTaken = (email) => {
  return User.findByEmail(email).then((user) => {
    if (user) {
      return Promise.reject(new Error('Email already exists'));
    }
  });
};

const register = [
  check('name')
    .isLength({ min: 1 })
    .withMessage('Name is required')
    .isAlpha('en-US', { ignore: ' -' })
    .withMessage('Name must not contain anything other than alphabet')
    .trim()
    .escape(),
  check('username')
    .isLength({ min: 1 })
    .withMessage('Username is required')
    .custom((username) => !username.includes(' '))
    .withMessage('No spaces are allowed in the username')
    .isAlphanumeric('en-US', { ignore: ' -' })
    .withMessage('Username must not contain anything other than alphabet')
    .trim()
    .escape()
    .custom(isUsernameTaken),
  check('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail()
    .trim()
    .escape()
    .custom(isEmailTaken),
  check('password')
    .isLength({ min: 8 })
    .withMessage('Password is required and must be at least 8 characters long')
    .isStrongPassword()
    .withMessage(
      'Password should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol'
    ),
  check('role')
    .not()
    .notEmpty()
    .withMessage('Role is required')
    .isIn(roles)
    .withMessage('Invalid role')
    .trim()
    .escape(),
];

const login = [
  check('email')
    .notEmpty()
    .withMessage('Email is required')
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

const profile = [
  param('userId')
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Invalid params value'),
];

// Module exports
module.exports = {
  register,
  login,
  profile,
};
