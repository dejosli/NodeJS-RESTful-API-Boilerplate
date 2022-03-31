// External module imports
const mongoose = require('mongoose');

// Internal module imports
const { toJSON } = require('./plugins');
const { services, serviceTypes } = require('../config/otpServices');

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
    serviceType: {
      type: String,
      enum: services,
      default: serviceTypes.GOOGLE_AUTHENTICATOR,
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
