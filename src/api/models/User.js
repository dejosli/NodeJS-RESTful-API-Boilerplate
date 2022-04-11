// External module imports
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Internal module imports
const config = require('../../config/config');
const { toJSON, offsetBasedPaginate } = require('./plugins');
const { allRoles, roles } = require('../../config/roles');

/**
 * User Schema
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
      required: false,
      minLength: 8,
      trim: true,
      select: false,
      private: true, // used by the toJSON plugin
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: roles,
      default: allRoles.USER.value,
    },
    profilePicture: {
      // link
      type: String,
      required: false,
      trim: true,
      default: '',
    },
    active: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isTwoFactorAuthEnabled: {
      type: Boolean,
      default: false,
    },
    OAuthProvider: {
      type: String,
      required: false,
    },
    OAuthID: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);
// create a text index
userSchema.index({
  name: 'text',
  email: 'text',
  role: 'text',
});

/**
 * Plugins
 */
userSchema.plugin(toJSON);
userSchema.plugin(offsetBasedPaginate);

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
    const salt = await bcrypt.genSalt(config.bcryptSaltRounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.pre(
  ['updateOne', 'updateById', 'findOneAndUpdate', 'findByIdAndUpdate'],
  async function (next) {
    try {
      // if password is updated
      if (this._update.password) {
        const salt = await bcrypt.genSalt(config.bcryptSaltRounds);
        this._update.password = await bcrypt.hash(this._update.password, salt);
      }
      next();
    } catch (err) {
      next(err);
    }
  }
);

/**
 * Statics
 */

/**
 * @desc Check if username already exists in the database
 * @param {string} username
 * @returns {Promise<User>}
 */
userSchema.statics.findByUsername = async function (username) {
  return this.findOne({ username });
};

/**
 * @desc Check if email already exists in the database
 * @param {string} email
 * @returns {Promise<User>}
 */
userSchema.statics.findByEmail = async function (email) {
  return this.findOne({ email });
};

/**
 * @desc Check if email already exists in the database
 * @param {string} OAuthID
 * @returns {Promise<User>}
 */
userSchema.statics.findByOAuthID = async function (OAuthID) {
  return this.findOne({ OAuthID });
};

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<User>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  return this.findOne({ email, _id: { $ne: excludeUserId } });
};

userSchema.statics.generateUniqueUsername = async function (givenName) {
  let proposedName = givenName;
  const user = await this.findOne({ username: proposedName });
  if (user) {
    proposedName += Math.floor(Math.random() * 100 + 1);
    return this.generateUniqueUsername(proposedName);
  }
  return proposedName;
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
