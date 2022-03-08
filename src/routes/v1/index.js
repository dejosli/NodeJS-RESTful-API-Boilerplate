// External module imports
const express = require('express');
const httpStatus = require('http-status');

// Internal module imports
const { SuccessResponse } = require('../../utils');
const authLimiter = require('../../middlewares/authLimiter');

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

/**
 * @swagger
 * tags:
 *   name: Default
 *   description: Default documentation description
 */

/**
 * @swagger
 * /ping:
 *  get:
 *    summary: Checks if the server is running
 *    tags: [Default]
 *    responses:
 *      200:
 *        description: Server is up and running
 */
router.get('/ping', (req, res, next) => {
  res.status(httpStatus.OK).json(new SuccessResponse(httpStatus.OK, 'Pong!'));
});

// Module exports
module.exports = router;
