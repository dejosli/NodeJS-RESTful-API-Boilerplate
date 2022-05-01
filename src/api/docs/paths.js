// External module imports
require('module-alias/register');

// Internal module imports
const { httpStatus, httpMessage } = require('config/custom-http-status');
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

  // auth routes
  '/auth/register': {
    post: {
      tags: ['auth'],
      summary: 'Register a new user',
      operationId: 'createUser',
      requestBody: {
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              required: [
                'name',
                'username',
                'email',
                'password',
                'phoneNumber',
              ],
              properties: {
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
                },
                phoneNumber: {
                  type: 'string',
                },
                role: {
                  type: 'string',
                },
                profilePicture: {
                  type: 'file',
                  format: 'binary',
                },
              },
            },
          },
        },
        required: true,
      },
      responses: {
        [httpStatus.CREATED]: {
          description: httpMessage[httpStatus.CREATED],
        },
        [httpStatus.FORBIDDEN]: {
          description: httpMessage[httpStatus.FORBIDDEN],
        },
        [httpStatus.UNAUTHORIZED]: {
          description: httpMessage[httpStatus.UNAUTHORIZED],
        },
        [httpStatus.TOO_MANY_REQUESTS]: {
          description: httpStatus[httpStatus.TOO_MANY_REQUESTS],
        },
        [httpStatus.INTERNAL_SERVER_ERROR]: {
          description: httpMessage[httpStatus.INTERNAL_SERVER_ERROR],
        },
      },
    },
  },
  '/auth/login': {
    post: {
      tags: ['auth'],
      summary: 'Login user',
      operationId: 'login',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'password'],
              properties: {
                email: {
                  type: 'string',
                },
                password: {
                  type: 'string',
                },
              },
            },
            examples: {
              editor: {
                summary: 'Example - Login',
                value: {
                  email: 'dylan.young@example.com',
                  password: 'Dylan@1234',
                },
              },
            },
          },
        },
        required: true,
      },
      responses: {
        [httpStatus.OK]: {
          description: httpStatus[httpStatus.OK],
        },
        [httpStatus.BAD_REQUEST]: {
          description: httpMessage[httpStatus.BAD_REQUEST],
        },
        [httpStatus.UNAUTHORIZED]: {
          description: httpMessage.USER_LOGIN_ERROR,
        },
        [httpStatus.TOO_MANY_REQUESTS]: {
          description: httpStatus[httpStatus.TOO_MANY_REQUESTS],
        },
        [httpStatus.INTERNAL_SERVER_ERROR]: {
          description: httpMessage[httpStatus.INTERNAL_SERVER_ERROR],
        },
      },
    },
  },
  '/auth/logout': {
    delete: {
      tags: ['auth'],
      summary: 'Logout user',
      operationId: 'logout',
      responses: {
        [httpStatus.NO_CONTENT]: {
          description: httpStatus[httpStatus.NO_CONTENT],
        },
        [httpStatus.UNAUTHORIZED]: {
          description: httpMessage[httpStatus.UNAUTHORIZED],
        },
        [httpStatus.TOO_MANY_REQUESTS]: {
          description: httpStatus[httpStatus.TOO_MANY_REQUESTS],
        },
        [httpStatus.INTERNAL_SERVER_ERROR]: {
          description: httpMessage[httpStatus.INTERNAL_SERVER_ERROR],
        },
      },
      security,
    },
  },
  '/auth/refresh-tokens': {
    get: {
      tags: ['auth'],
      summary: 'Refresh tokens',
      operationId: 'refreshTokens',
      responses: {
        [httpStatus.OK]: {
          description: httpStatus[httpStatus.OK],
        },
        [httpStatus.UNAUTHORIZED]: {
          description: httpMessage[httpStatus.UNAUTHORIZED],
        },
        [httpStatus.TOO_MANY_REQUESTS]: {
          description: httpStatus[httpStatus.TOO_MANY_REQUESTS],
        },
        [httpStatus.INTERNAL_SERVER_ERROR]: {
          description: httpMessage[httpStatus.INTERNAL_SERVER_ERROR],
        },
      },
      security,
    },
  },
  '/auth/forgot-password': {
    post: {
      tags: ['auth'],
      summary: 'Forgot password',
      operationId: 'forgotPassword',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email'],
              properties: {
                email: {
                  type: 'string',
                },
              },
            },
            examples: {
              user: {
                summary: 'Requested email',
                value: {
                  email: 'dylan.young@example.com',
                },
              },
            },
          },
        },
        required: true,
      },
      responses: {
        [httpStatus.OK]: {
          description: httpStatus[httpStatus.OK],
        },
        [httpStatus.BAD_REQUEST]: {
          description: httpMessage[httpStatus.BAD_REQUEST],
        },
        [httpStatus.TOO_MANY_REQUESTS]: {
          description: httpStatus[httpStatus.TOO_MANY_REQUESTS],
        },
        [httpStatus.INTERNAL_SERVER_ERROR]: {
          description: httpMessage[httpStatus.INTERNAL_SERVER_ERROR],
        },
      },
    },
  },
  '/auth/reset-password': {
    post: {
      tags: ['auth'],
      summary: 'Reset password',
      operationId: 'resetPassword',
      parameters: [
        {
          name: 'token',
          in: 'query',
          description: 'include token to reset password',
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
              type: 'object',
              required: ['password'],
              properties: {
                password: {
                  type: 'string',
                },
              },
            },
            examples: {
              user: {
                summary: 'Changed password',
                value: {
                  password: 'Young@1234',
                },
              },
            },
          },
        },
        required: true,
      },
      responses: {
        [httpStatus.OK]: {
          description: httpStatus[httpStatus.OK],
        },
        [httpStatus.UNAUTHORIZED]: {
          description: httpMessage[httpStatus.UNAUTHORIZED],
        },
        [httpStatus.BAD_REQUEST]: {
          description: httpMessage[httpStatus.BAD_REQUEST],
        },
        [httpStatus.TOO_MANY_REQUESTS]: {
          description: httpStatus[httpStatus.TOO_MANY_REQUESTS],
        },
        [httpStatus.INTERNAL_SERVER_ERROR]: {
          description: httpMessage[httpStatus.INTERNAL_SERVER_ERROR],
        },
      },
      security,
    },
  },
  '/auth/send-verification-email': {
    post: {
      tags: ['auth'],
      summary: 'Send verification email',
      operationId: 'sendVerificationEmail',
      responses: {
        [httpStatus.OK]: {
          description: httpStatus[httpStatus.OK],
        },
        [httpStatus.BAD_REQUEST]: {
          description: httpMessage[httpStatus.BAD_REQUEST],
        },
        [httpStatus.TOO_MANY_REQUESTS]: {
          description: httpStatus[httpStatus.TOO_MANY_REQUESTS],
        },
        [httpStatus.INTERNAL_SERVER_ERROR]: {
          description: httpMessage[httpStatus.INTERNAL_SERVER_ERROR],
        },
      },
    },
  },
  '/auth/verify-email': {
    post: {
      tags: ['auth'],
      summary: 'Verify Email',
      operationId: 'verifyEmail',
      parameters: [
        {
          name: 'token',
          in: 'query',
          description: 'include token to verify email',
          required: true,
          schema: {
            type: 'string',
          },
        },
      ],
      responses: {
        [httpStatus.OK]: {
          description: httpStatus[httpStatus.OK],
        },
        [httpStatus.UNAUTHORIZED]: {
          description: httpMessage[httpStatus.UNAUTHORIZED],
        },
        [httpStatus.BAD_REQUEST]: {
          description: httpMessage[httpStatus.BAD_REQUEST],
        },
        [httpStatus.TOO_MANY_REQUESTS]: {
          description: httpStatus[httpStatus.TOO_MANY_REQUESTS],
        },
        [httpStatus.INTERNAL_SERVER_ERROR]: {
          description: httpMessage[httpStatus.INTERNAL_SERVER_ERROR],
        },
      },
      security,
    },
  },
  '/auth/google': {
    get: {
      tags: ['auth'],
      summary: 'Login using google oauth2',
      operationId: 'passport',
      responses: {
        [httpStatus.OK]: {
          description: httpStatus[httpStatus.OK],
        },
        [httpStatus.BAD_REQUEST]: {
          description: httpMessage[httpStatus.BAD_REQUEST],
        },
        [httpStatus.UNAUTHORIZED]: {
          description: httpMessage.USER_LOGIN_ERROR,
        },
        [httpStatus.TOO_MANY_REQUESTS]: {
          description: httpStatus[httpStatus.TOO_MANY_REQUESTS],
        },
        [httpStatus.INTERNAL_SERVER_ERROR]: {
          description: httpMessage[httpStatus.INTERNAL_SERVER_ERROR],
        },
      },
    },
  },
  '/auth/facebook': {
    get: {
      tags: ['auth'],
      summary: 'Login using facebook oauth2',
      operationId: 'passport',
      responses: {
        [httpStatus.OK]: {
          description: httpStatus[httpStatus.OK],
        },
        [httpStatus.BAD_REQUEST]: {
          description: httpMessage[httpStatus.BAD_REQUEST],
        },
        [httpStatus.UNAUTHORIZED]: {
          description: httpMessage.USER_LOGIN_ERROR,
        },
        [httpStatus.TOO_MANY_REQUESTS]: {
          description: httpStatus[httpStatus.TOO_MANY_REQUESTS],
        },
        [httpStatus.INTERNAL_SERVER_ERROR]: {
          description: httpMessage[httpStatus.INTERNAL_SERVER_ERROR],
        },
      },
    },
  },
  '/auth/otp/send': {
    post: {
      tags: ['auth'],
      summary: 'Enable or disable two factor authentication',
      operationId: 'sendOtpCode',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                enabled: {
                  type: 'boolean',
                },
                send_otp: {
                  type: 'string',
                },
              },
            },
            examples: {
              enable: {
                summary: 'Enable 2FA',
                value: {
                  enabled: true,
                  send_otp: 'google-authenticator',
                },
              },
              disable: {
                summary: 'Disable 2FA',
                value: {
                  enabled: false,
                },
              },
            },
          },
        },
        required: true,
      },
      responses: {
        [httpStatus.OK]: {
          description: httpStatus[httpStatus.OK],
        },
        [httpStatus.UNAUTHORIZED]: {
          description: httpMessage[httpStatus.UNAUTHORIZED],
        },
        [httpStatus.BAD_REQUEST]: {
          description: httpMessage[httpStatus.BAD_REQUEST],
        },
        [httpStatus.TOO_MANY_REQUESTS]: {
          description: httpStatus[httpStatus.TOO_MANY_REQUESTS],
        },
        [httpStatus.INTERNAL_SERVER_ERROR]: {
          description: httpMessage[httpStatus.INTERNAL_SERVER_ERROR],
        },
      },
      security,
    },
  },
  '/auth/otp/verify': {
    post: {
      tags: ['auth'],
      summary: 'Verify two factor authentication code',
      operationId: 'verifyOtpCode',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['otp_id', 'otp_code'],
              properties: {
                otp_id: {
                  type: 'string',
                },
                otp_code: {
                  type: 'string',
                },
              },
            },
          },
        },
        required: true,
      },
      responses: {
        [httpStatus.OK]: {
          description: httpStatus[httpStatus.OK],
        },
        [httpStatus.UNAUTHORIZED]: {
          description: httpMessage.OTP_VERIFICATION_ERROR,
        },
        [httpStatus.BAD_REQUEST]: {
          description: httpMessage[httpStatus.BAD_REQUEST],
        },
        [httpStatus.TOO_MANY_REQUESTS]: {
          description: httpStatus[httpStatus.TOO_MANY_REQUESTS],
        },
        [httpStatus.INTERNAL_SERVER_ERROR]: {
          description: httpMessage[httpStatus.INTERNAL_SERVER_ERROR],
        },
      },
    },
  },
  '/auth/otp/resend': {
    post: {
      tags: ['auth'],
      summary: 'Resend two factor authentication code',
      operationId: 'resendOtpCode',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['otp_id'],
              properties: {
                otp_id: {
                  type: 'string',
                },
              },
            },
          },
        },
        required: true,
      },
      responses: {
        [httpStatus.OK]: {
          description: httpStatus[httpStatus.OK],
        },
        [httpStatus.BAD_REQUEST]: {
          description: httpMessage[httpStatus.BAD_REQUEST],
        },
        [httpStatus.TOO_MANY_REQUESTS]: {
          description: httpStatus[httpStatus.TOO_MANY_REQUESTS],
        },
        [httpStatus.INTERNAL_SERVER_ERROR]: {
          description: httpMessage[httpStatus.INTERNAL_SERVER_ERROR],
        },
      },
    },
  },

  // users routes
  '/users': {
    get: {
      tags: ['user'],
      summary: 'Get all users',
      operationId: 'getUsers',
      parameters: [
        {
          name: 'include_metadata',
          in: 'query',
          description: 'include metadata for pagination',
          required: false,
          schema: {
            type: 'boolean',
          },
        },
      ],
      responses: {
        [httpStatus.OK]: {
          description: httpStatus[httpStatus.OK],
        },
        [httpStatus.FORBIDDEN]: {
          description: httpMessage[httpStatus.FORBIDDEN],
        },
        [httpStatus.UNAUTHORIZED]: {
          description: httpMessage[httpStatus.UNAUTHORIZED],
        },
        [httpStatus.TOO_MANY_REQUESTS]: {
          description: httpStatus[httpStatus.TOO_MANY_REQUESTS],
        },
        [httpStatus.INTERNAL_SERVER_ERROR]: {
          description: httpMessage[httpStatus.INTERNAL_SERVER_ERROR],
        },
      },
      security,
    },
    post: {
      tags: ['user'],
      summary: 'Create a new user',
      operationId: 'createUser',
      requestBody: {
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              required: [
                'name',
                'username',
                'email',
                'password',
                'phoneNumber',
                'role',
              ],
              properties: {
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
                },
                phoneNumber: {
                  type: 'string',
                },
                role: {
                  type: 'string',
                },
                profilePicture: {
                  type: 'file',
                  format: 'binary',
                },
              },
            },
          },
        },
        required: true,
      },
      responses: {
        [httpStatus.CREATED]: {
          description: httpMessage[httpStatus.CREATED],
        },
        [httpStatus.FORBIDDEN]: {
          description: httpMessage[httpStatus.FORBIDDEN],
        },
        [httpStatus.UNAUTHORIZED]: {
          description: httpMessage[httpStatus.UNAUTHORIZED],
        },
        [httpStatus.TOO_MANY_REQUESTS]: {
          description: httpStatus[httpStatus.TOO_MANY_REQUESTS],
        },
        [httpStatus.INTERNAL_SERVER_ERROR]: {
          description: httpMessage[httpStatus.INTERNAL_SERVER_ERROR],
        },
      },
      security,
    },
  },
  '/users/{userId}': {
    get: {
      tags: ['user'],
      summary: 'Get a particular user',
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
        [httpStatus.OK]: {
          description: httpStatus[httpStatus.OK],
        },
        [httpStatus.FORBIDDEN]: {
          description: httpMessage[httpStatus.FORBIDDEN],
        },
        [httpStatus.UNAUTHORIZED]: {
          description: httpMessage[httpStatus.UNAUTHORIZED],
        },
        [httpStatus.TOO_MANY_REQUESTS]: {
          description: httpStatus[httpStatus.TOO_MANY_REQUESTS],
        },
        [httpStatus.INTERNAL_SERVER_ERROR]: {
          description: httpMessage[httpStatus.INTERNAL_SERVER_ERROR],
        },
      },
      security,
    },
    put: {
      tags: ['user'],
      summary: 'Update a particular user',
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
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                },
                email: {
                  type: 'string',
                },
                password: {
                  type: 'string',
                },
              },
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
        [httpStatus.OK]: {
          description: httpStatus[httpStatus.OK],
        },
        [httpStatus.BAD_REQUEST]: {
          description: httpMessage[httpStatus.BAD_REQUEST],
        },
        [httpStatus.FORBIDDEN]: {
          description: httpMessage[httpStatus.FORBIDDEN],
        },
        [httpStatus.UNAUTHORIZED]: {
          description: httpMessage[httpStatus.UNAUTHORIZED],
        },
        [httpStatus.TOO_MANY_REQUESTS]: {
          description: httpStatus[httpStatus.TOO_MANY_REQUESTS],
        },
        [httpStatus.INTERNAL_SERVER_ERROR]: {
          description: httpMessage[httpStatus.INTERNAL_SERVER_ERROR],
        },
      },
      security,
    },
    delete: {
      tags: ['user'],
      summary: 'Delete a particular user',
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
        [httpStatus.NO_CONTENT]: {
          description: httpStatus[httpStatus.NO_CONTENT],
        },
        [httpStatus.FORBIDDEN]: {
          description: httpMessage[httpStatus.FORBIDDEN],
        },
        [httpStatus.UNAUTHORIZED]: {
          description: httpMessage[httpStatus.UNAUTHORIZED],
        },
        [httpStatus.TOO_MANY_REQUESTS]: {
          description: httpStatus[httpStatus.TOO_MANY_REQUESTS],
        },
        [httpStatus.INTERNAL_SERVER_ERROR]: {
          description: httpMessage[httpStatus.INTERNAL_SERVER_ERROR],
        },
      },
      security,
    },
  },
};
