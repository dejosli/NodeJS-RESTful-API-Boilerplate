// Internal module imports
const config = require('../../config/config');
const { version } = require('../../../package.json');

const tags = require('./tags');
const paths = require('./paths');
const components = require('./components');

// swagger definitions
module.exports = {
  openapi: '3.0.1',
  info: {
    title: 'NodeJS RESTful API Boilerplate Documentation',
    description:
      'This is a simple and clean Node.js RESTful API Boilerplate documentation made with Express and documented with SwaggerJSDoc',

    termsOfService: 'http://swagger.io/terms/',
    contact: {
      email: 'bjoslishubho@gmail.com',
    },
    license: {
      name: 'MIT',
      url: 'https://github.com/dejosli/NodeJS-RESTful-API-Boilerplate/blob/main/LICENSE',
    },
    version,
  },
  externalDocs: {
    description: 'Find out more about Swagger',
    url: 'http://swagger.io',
  },
  servers: [
    {
      url: `http://localhost:${config.port}/api/v1`,
    },
  ],
  tags,
  paths,
  components,
};
