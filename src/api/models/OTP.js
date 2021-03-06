// External module imports
const mongoose = require('mongoose');

// Internal module imports
const { methods, verificationMethods } = require('../../config/otps');
const { toJSON } = require('./plugins');

/**
 * Time-based One Time Password Schema
 * @private
 */
const otpSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'People',
      required: true,
    },
    secretKey: {
      type: String,
      index: true,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationMethod: {
      type: String,
      enum: methods,
      default: verificationMethods.GOOGLE_AUTHENTICATOR,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Plugins
 */
otpSchema.plugin(toJSON);

/**
 * Statics
 */
/**

/**
 * Methods
 */

/**
 * @typedef OTP
 */
module.exports = mongoose.model('OTP', otpSchema);
