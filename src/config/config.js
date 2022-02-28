// External module imports
const path = require('path');
const dotenv = require('dotenv');
const Joi = require('joi');

// init dotenv path
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid('production', 'development', 'test')
      .required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    ADMIN_EMAIL: Joi.string()
      .default('admin@example.com')
      .description('Admin registration email'),
    BCRYPT_SALT_ROUNDS: Joi.number()
      .default(15)
      .description('Bcrypt salt rounds'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_SESSION: Joi.string()
      .valid('true', 'false')
      .default('false')
      .description('JWT session'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description('minutes after which refresh tokens expire'),
    JWT_COOKIE_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description(
      'the from field in the emails sent by the app'
    ),
    GOOGLE_CLIENT_ID: Joi.string().description('google OAuth client id'),
    GOOGLE_CLIENT_SECRET: Joi.string().description(
      'google OAuth client secret'
    ),
    FACEBOOK_APP_ID: Joi.string().description('facebook OAuth app id'),
    FACEBOOK_APP_SECRET: Joi.string().description('facebook OAuth app secret'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error) {
  throw new Error(`Config Validation Error: ${error.message}`);
}

// Module exports
module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongodbUrl: envVars.MONGODB_URL,
  adminEmail: envVars.ADMIN_EMAIL,
  bcryptSaltRounds: envVars.BCRYPT_SALT_ROUNDS,
  jwt: {
    secret: envVars.JWT_SECRET,
    session: envVars.JWT_SESSION,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    cookieExpirationDays: envVars.JWT_COOKIE_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes:
      envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      secure: envVars.SMTP_PORT === 465, // true for 465, false for other ports
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  google: {
    clientID: envVars.GOOGLE_CLIENT_ID,
    clientSecret: envVars.GOOGLE_CLIENT_SECRET,
  },
  facebook: {
    clientID: envVars.FACEBOOK_APP_ID,
    clientSecret: envVars.FACEBOOK_APP_SECRET,
  },
};
