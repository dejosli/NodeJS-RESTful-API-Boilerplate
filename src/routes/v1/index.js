// External module imports
const express = require('express');
const httpStatus = require('http-status');

// Internal module imports
const SuccessResponse = require('../../utils/SuccessResponse');
const docsRoutes = require('./docsRoutes');

const router = express.Router();

// mount swagger docs routes
router.use('/docs', docsRoutes);

router.get('/ping', (req, res) => {
  res.status(httpStatus.OK).json(new SuccessResponse(httpStatus.OK, 'Pong!'));
});

// Module exports
module.exports = router;
