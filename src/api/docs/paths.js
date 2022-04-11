const { security } = require('./components');

module.exports = {
  '/ping': {
    get: {
      tags: ['ping'],
      responses: {
        200: {
          description: 'Server is up and running',
        },
      },
    },
  },

  // auth endpoints
  '/auth/login': {
    post: {
      tags: ['auth'],
      summary: 'Login user',
      operationId: 'login',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/User',
            },
            examples: {
              user: {
                summary: 'User Example',
                value: {
                  email: 'john.doe@example.com',
                  password: 'John@1234',
                },
              },
              editor: {
                summary: 'Editor Example',
                value: {
                  email: 'dylan.young@example.com',
                  password: 'Dylan@1234',
                },
              },
              admin: {
                summary: 'Admin Example',
                value: {
                  email: 'admin@example.com',
                  password: 'Admin@1234',
                },
              },
            },
          },
        },
        required: true,
      },
      responses: {
        200: {
          description: 'You logged in successfully',
        },
        400: {
          description: 'Bad Request',
        },
        401: {
          description: 'Wrong email or password',
        },
        429: {
          description: 'Too many requests',
        },
        500: {
          description: 'Internal server error',
        },
      },
    },
  },
  '/auth/logout': {
    delete: {
      tags: ['auth'],
      summary: 'Logout current user',
      operationId: 'logout',
      responses: {
        204: {
          description: 'Logout successful',
        },
        401: {
          description: 'Please authenticate',
        },
        429: {
          description: 'Too many requests',
        },
        500: {
          description: 'Internal server error',
        },
      },
      security,
    },
  },
  '/auth/refresh-tokens': {
    get: {
      tags: ['auth'],
      summary: 'Refresh Tokens',
      operationId: 'refreshTokens',
      responses: {
        200: {
          description: 'Logout successful',
        },
        401: {
          description: 'Please authenticate',
        },
        429: {
          description: 'Too many requests',
        },
        500: {
          description: 'Internal server error',
        },
      },
      security,
    },
  },

  // users endpoints
  '/users': {
    // GET request
    get: {
      tags: ['user'],
      summary: 'Get all users',
      operationId: 'getUsers',
      parameters: [
        {
          name: 'include_meta',
          in: 'query',
          description: 'include metadata for pagination',
          required: false,
          schema: {
            type: 'boolean',
          },
        },
      ],
      responses: {
        200: {
          description: 'All user details',
        },
        401: {
          description: 'Please authenticate',
        },
        403: {
          description: 'Access denied',
        },
        429: {
          description: 'Too many requests',
        },
        500: {
          description: 'Internal server error',
        },
      },
      security,
    },
    // POST request
    post: {
      tags: ['user'],
      summary: 'Create user',
      operationId: 'createUser',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/User',
            },
            examples: {
              user: {
                summary: 'User Example',
                value: {
                  name: 'Mitch Johnson',
                  username: 'johnson',
                  email: 'mitch@example.com',
                  password: 'Mitch@1234',
                  role: 'USER',
                },
              },
              editor: {
                summary: 'Editor Example',
                value: {
                  name: 'John Doe',
                  username: 'john',
                  email: 'john.doe@example.com',
                  password: 'John@1234',
                  role: 'EDITOR',
                },
              },
              admin: {
                summary: 'Admin Example',
                value: {
                  name: 'Fraser Bond',
                  username: 'bond',
                  email: 'fraser.bond@example.com',
                  password: 'Bond@1234',
                  role: 'ADMIN',
                },
              },
            },
          },
        },
        required: true,
      },
      responses: {
        201: {
          description: 'User created',
        },
        400: {
          description: 'Bad Request',
        },
        403: {
          description: 'Access denied',
        },
        429: {
          description: 'Too many requests',
        },
        500: {
          description: 'Internal server error',
        },
      },
      security,
    },
  },
  '/users/{userId}': {
    // GET request
    get: {
      tags: ['user'],
      summary: 'Get user by id',
      operationId: 'getUser',
      parameters: [
        {
          name: 'userId',
          in: 'path',
          description: 'Id of the user to be fetched',
          required: true,
          schema: {
            type: 'string',
          },
        },
      ],
      responses: {
        200: {
          description: 'Particular user details',
        },
        401: {
          description: 'Please authenticate',
        },
        403: {
          description: 'Access denied',
        },
        429: {
          description: 'Too many requests',
        },
        500: {
          description: 'Internal server error',
        },
      },
      security,
    },
    // PUT request
    put: {
      tags: ['user'],
      summary: 'Update user',
      operationId: 'updateUser',
      parameters: [
        {
          name: 'userId',
          in: 'path',
          description: 'Id of the user to be updated',
          required: true,
          schema: {
            type: 'string',
          },
        },
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/User',
            },
            examples: {
              user: {
                summary: 'User Example',
                value: {
                  name: 'Mitch Johnson',
                  email: 'mitch.johnson@example.com',
                  password: 'Johnson@1234',
                },
              },
              Editor: {
                summary: 'User Example',
                value: {
                  name: 'Mitch Johnson',
                  email: 'mitch1234@example.com',
                  password: 'Mitch@1234',
                  role: 'Editor',
                },
              },
              Admin: {
                summary: 'User Example',
                value: {
                  name: 'Mitch Johnson',
                  email: 'mitch1234@example.com',
                  password: 'Mitch@1234',
                  role: 'Admin',
                },
              },
            },
          },
        },
        required: true,
      },
      responses: {
        200: {
          description: 'User updated',
        },
        400: {
          description: 'Bad Request',
        },
        403: {
          description: 'Access denied',
        },
        429: {
          description: 'Too many requests',
        },
        500: {
          description: 'Internal server error',
        },
      },
      security,
    },
    // DELETE request
    delete: {
      tags: ['user'],
      summary: 'Delete user',
      operationId: 'deleteUser',
      parameters: [
        {
          name: 'userId',
          in: 'path',
          description: 'Id of the user to be deleted',
          required: true,
          schema: {
            type: 'string',
          },
        },
      ],
      responses: {
        204: {
          description: 'User deleted',
        },
        400: {
          description: 'Bad Request',
        },
        403: {
          description: 'Access denied',
        },
        429: {
          description: 'Too many requests',
        },
        500: {
          description: 'Internal server error',
        },
      },
      security,
    },
  },
};
