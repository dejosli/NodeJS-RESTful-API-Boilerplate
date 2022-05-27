// External module imports
const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

// Internal module imports
const swaggerDefinition = require('../../docs/swaggerDef');

const router = express.Router();

const swaggerSpec = swaggerJsdoc({
  swaggerDefinition,
  apis: ['src/docs/*.json', 'src/docs/*.js', 'src/routes/v1/*.js'],
});

const options = {
  explorer: true,
};

// mount routes
router.use('/', swaggerUI.serve);
router.get('/', swaggerUI.setup(swaggerSpec, options));

// Module exports
module.exports = router;
