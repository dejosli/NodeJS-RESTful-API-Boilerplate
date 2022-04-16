// External module imports
require('module-alias/register');
const express = require('express');

// Internal module imports
const { SuccessResponse } = require('utils');
const { httpStatus } = require('config/custom-http-status');
const authLimiter = require('middleware/authentication/authLimiter');

const docsRoutes = require('./docsRoutes');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');

const router = express.Router();

// mount documentation routes
router.use('/api-docs', docsRoutes);

// mount authentication routes
router.use('/auth', authLimiter, authRoutes);

// mount users routes
router.use('/users', userRoutes);

router.get('/ping', (req, res, next) => {
  res.status(httpStatus.OK).json(new SuccessResponse(httpStatus.OK, 'Pong!!'));
});

// Module exports
module.exports = router;
