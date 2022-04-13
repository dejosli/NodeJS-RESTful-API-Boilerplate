// External module imports
require('module-alias/register');
const mongoose = require('mongoose');

// Internal module imports
const { tokenTypes, types } = require('config/tokens');
const { toJSON } = require('./plugins');

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
      index: true,
      required: true,
    },
    type: {
      type: String,
      enum: types,
      required: true,
    },
    deviceId: {
      type: mongoose.SchemaTypes.ObjectId,
      unique: true,
      required: false,
    },
    expireAt: {
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
tokenSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

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
 * @param {ObjectId} userId
 * @param {ObjectId} deviceId
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
tokenSchema.statics.findToken = async function ({
  userId,
  deviceId,
  type = tokenTypes.REFRESH,
  blacklisted = false,
}) {
  return this.findOne({
    $and: [{ user: userId }, { deviceId }, { type }, { blacklisted }],
  }).populate('user');
};

/**
 * Remove token
 * @param {ObjectId} userId
 * @param {ObjectId} deviceId
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
tokenSchema.statics.deleteOneToken = async function ({
  userId,
  deviceId,
  type = tokenTypes.REFRESH,
  blacklisted = false,
}) {
  return this.deleteOne({
    $and: [{ user: userId }, { deviceId }, { type }, { blacklisted }],
  });
};

/**
 * Remove token
 * @param {ObjectId} userId
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
tokenSchema.statics.deleteManyToken = async function ({
  userId,
  type = tokenTypes.REFRESH,
  blacklisted = false,
}) {
  return this.deleteMany({
    $and: [{ user: userId }, { type }, { blacklisted }],
  });
};

/**
 * @typedef Token
 */
module.exports = mongoose.model('Token', tokenSchema);
