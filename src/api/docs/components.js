// External module imports
require('module-alias/register');

// Internal module imports
const { allRoles, roles } = require('config/roles');

const schemas = {
  // user model
  User: {
    type: 'object',
    required: ['name', 'username', 'email', 'password', 'phoneNumber', 'role'],
    properties: {
      id: {
        type: 'string',
      },
      name: {
        type: 'string',
      },
      username: {
        type: 'string',
      },
      email: {
        type: 'string',
      },
      password: {
        type: 'string',
        description: 'No password required to login with OAuth 2.0',
      },
      phoneNumber: {
        type: 'string',
      },
      role: {
        type: 'string',
        enum: roles,
        default: allRoles.USER.alias,
      },
      profilePicture: {
        type: 'string',
        default: '',
      },
      isActive: {
        type: 'boolean',
        default: true,
      },
      isEmailVerified: {
        type: 'boolean',
        default: false,
      },
      OAuthProvider: {
        type: 'string',
      },
      OAuthID: {
        type: 'string',
      },
    },
  },
};

// Define the security scheme type (HTTP bearer)
const securitySchemes = {
  // arbitrary name for the security scheme
  bearerAuth: {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT', // optional, arbitrary value for documentation purposes
  },
};

const security = [
  {
    bearerAuth: [],
  },
];

// Module exports
module.exports = {
  schemas,
  securitySchemes,
  security,
};
