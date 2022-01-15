const { version } = require('../../package.json');
const config = require('../config/config');

const swaggerDef = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'NodeJS-RESTful-API-Boilerplate Documentation',
      version,
      description:
        'This is a simple and clean Node.js RESTful API Boilerplate documentation made with Express and documented with Swagger',
      license: {
        name: 'MIT',
        url: 'https://github.com/dejosli/NodeJS-RESTful-API-Boilerplate/blob/main/LICENSE',
      },
      contact: {
        name: 'Josli Shubho Biswas',
        url: 'https://github.com/dejosli',
        email: 'bjoslishubho@gmail.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}/api/v1`,
      },
    ],
  },
};

module.exports = swaggerDef;
