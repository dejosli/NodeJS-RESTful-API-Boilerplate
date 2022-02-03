// External module imports
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Internal module imports
const config = require('../config/config');
const { toJSON } = require('./plugins');

const saltRounds = 10; // required for hashing the password

/**
 * User Schema
 * @private
 */
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      trim: true,
      select: false,
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: ['user', 'editor', 'admin'],
      default: 'user',
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

/**
 * Plugins
 */
userSchema.plugin(toJSON);

/**
 * Hooks
 */
userSchema.pre('save', async function (next) {
  // encrypt password using bcrypt
  const salt = await bcrypt.genSalt(saltRounds);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Statics
 */

/**
 * @desc Check if email already exists in the database
 * @param {string} email
 * @returns {Promise<boolean>}
 */
userSchema.statics.findByEmail = async function (email) {
  return this.findOne({ email });
};

/**
 * Methods
 */

/**
 * @desc Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  return bcrypt.compare(password, this.password);
};

/**
 * @desc Generate signed jwt token
 * @param {string} type
 * @returns {string}
 */
userSchema.methods.getSignedJwtToken = function () {
  const accessExpirationMinutes = config.jwt.accessExpirationMinutes * 60; // 1min = 60s
  const opts = {
    expiresIn: accessExpirationMinutes,
  };
  const payload = {
    sub: this._id,
  };
  return jwt.sign(payload, config.jwt.secret, opts);
};

/**
 * @typedef User
 */
module.exports = mongoose.model('People', userSchema);
