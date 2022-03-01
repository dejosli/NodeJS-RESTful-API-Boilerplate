// Internal module imports
const { version } = require('../../package.json');
const config = require('../config/config');

// define swagger
const swaggerDef = {
  swagger: '2.0',
  info: {
    version,
    description:
      'This is a simple and clean Node.js RESTful API Boilerplate documentation made with Express and documented with SwaggerJSDoc',
    title: 'NodeJS RESTful API Boilerplate Documentation',
    termsOfService: 'http://swagger.io/terms/',
    contact: {
      email: 'bjoslishubho@gmail.com',
    },
    license: {
      name: 'MIT',
      url: 'https://github.com/dejosli/NodeJS-RESTful-API-Boilerplate/blob/main/LICENSE',
    },
  },
  host: `localhost:${config.port}`,
  basePath: '/api/v1',
  schemes: ['https', 'http'],
  servers: [
    {
      url: `http://localhost:${config.port}`,
    },
  ],
  externalDocs: {
    description: 'Find out more about Swagger',
    url: 'http://swagger.io',
  },
};

// Module exports
module.exports = swaggerDef;
