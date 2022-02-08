// External module imports
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Internal module imports
const config = require('../config/config');
const { toJSON } = require('./plugins');
const { allRoles, roles } = require('../config/roles');

const saltRounds = 15; // required for hashing the password

/**
 * User Schema
 * @private
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
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
      enum: roles,
      default: allRoles.USER.value,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    // resetPasswordToken: {
    //   type: String,
    //   required: false,
    // },
    // resetPasswordExpireIn: {
    //   type: Date,
    //   required: false,
    // },
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
  try {
    // set user role to admin
    if (this.email === config.adminEmail) {
      this.role = allRoles.ADMIN.value;
    }
    // if password is not changed
    if (!this.isModified('password')) {
      return next();
    }
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

/**
 * Statics
 */

/**
 * @desc Check if username already exists in the database
 * @param {string} username
 * @returns {Promise<boolean>}
 */
userSchema.statics.findByUsername = async function (username) {
  return this.findOne({ username });
};

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
 * @typedef User
 */
module.exports = mongoose.model('People', userSchema);
