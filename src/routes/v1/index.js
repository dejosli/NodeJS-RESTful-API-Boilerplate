// External module imports
const express = require('express');
const httpStatus = require('http-status');

// Internal module imports
const { SuccessResponse } = require('../../utils/SuccessResponse');
const docsRoutes = require('./docsRoutes');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');

const router = express.Router();

// mount swagger docs routes
router.use('/docs', docsRoutes);

// mount authentication routes
router.use('/auth', authRoutes);

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
 * /api/v1/ping:
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
