// External module imports
require('module-alias/register');
const mongoose = require('mongoose');

// Internal module imports
const { User } = require('models');
const { allRoles, roles } = require('config/roles');

// check whether id is mongo ObjectId or not
const isObjectId = (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return true;
  }
  return Promise.reject(new Error('Invalid value'));
};

// check whether email already exists or not
const isEmailTaken = (email) => {
  return User.findByEmail(email).then((user) => {
    if (user) {
      return Promise.reject(new Error('Email already exists'));
    }
  });
};

// check whether username already exists or not
const isUsernameTaken = (username) => {
  return User.findByUsername(username).then((user) => {
    if (user) {
      return Promise.reject(new Error('Username already exists'));
    }
  });
};

// check whether user role valid or not
const isInRoles = (role, { req }) => {
  if (!role) {
    return Promise.reject(new Error('Role is required'));
  }
  if (req.baseUrl.includes('auth')) {
    return role === allRoles.USER.alias
      ? true
      : Promise.reject(new Error('Invalid role'));
  }
  return roles.indexOf(role) > -1
    ? true
    : Promise.reject(new Error('Invalid role'));
};

const isOtpEnabled = (type, { req }) => {
  const { enabled } = req.body;
  const types = ['email', 'sms', 'none'];
  if (enabled === 'true' && !type) {
    return Promise.reject(new Error('Service type is required'));
  }
  if (enabled === 'true' && !types.includes(type)) {
    return Promise.reject(new Error('Invalid service type'));
  }
  return true;
};

// Module exports
module.exports = {
  isObjectId,
  isEmailTaken,
  isUsernameTaken,
  isInRoles,
  isOtpEnabled,
};
