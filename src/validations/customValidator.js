// External module imports
const mongoose = require('mongoose');

// Internal module imports
const { User } = require('../models');

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

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

// Module exports
module.exports = {
  isUsernameTaken,
  isEmailTaken,
  isObjectId,
};
