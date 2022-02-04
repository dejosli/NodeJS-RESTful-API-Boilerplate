// External module imports
const mongoose = require('mongoose');
// const moment = require('moment');

// Internal module imports
const { toJSON } = require('./plugins');
const { tokenTypes } = require('../config/tokens');
// const config = require('../config/config');

/**
 * Token Schema
 * @private
 */
const tokenSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'People',
      required: true,
    },
    token: {
      type: String,
      //   index: true,
      required: true,
    },
    type: {
      type: String,
      enum: [
        tokenTypes.REFRESH,
        tokenTypes.RESET_PASSWORD,
        tokenTypes.VERIFY_EMAIL,
      ],
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// set total-live-time for tokens document
tokenSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });

// set total-live-time for tokens document
// const expireAfterSeconds = moment
//   .duration(config.jwt.refreshExpirationDays, 'days')
//   .asSeconds();
// tokenSchema.index({ createdAt: 1 }, { expireAfterSeconds });

/**
 * Plugins
 */
tokenSchema.plugin(toJSON);

/**
 * Statics
 */

/**
 * Find token
 * @param {ObjectID} userId
 * @param {string} type
 * @param {Boolean} blacklisted
 * @returns {Promise<Token>}
 */
tokenSchema.statics.findToken = async function (
  userId,
  type = tokenTypes.REFRESH,
  blacklisted = false
) {
  return this.findOne({
    $and: [{ user: userId }, { type }, { blacklisted }],
  }).populate('user');
};

/**
 * Remove token
 * @param {ObjectID} userId
 * @param {string} type
 * @param {Boolean} blacklisted
 * @returns {Promise<Token>}
 */
tokenSchema.statics.deleteToken = async function (
  userId,
  type = tokenTypes.REFRESH,
  blacklisted = false
) {
  return this.findOneAndDelete({
    $and: [{ user: userId }, { type }, { blacklisted }],
  });
};

/**
 * @typedef Token
 */
module.exports = mongoose.model('Token', tokenSchema);
