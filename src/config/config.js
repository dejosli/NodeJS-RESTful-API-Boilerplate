// External module imports
const path = require('path');
const dotenv = require('dotenv');
const Joi = require('joi');

// init dotenv path
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    PORT: Joi.number().default(5000).description('Server port number'),
    HOST: Joi.string()
      .default('localhost')
      .description('Server hostname/ip address'),
    NODE_ENV: Joi.string()
      .valid('production', 'development', 'test')
      .default('development'),
    APP_NAME: Joi.string().description('Application name'),
    MONGODB_URL: Joi.string().required().description('MongoDB connection url'),
    ADMIN_EMAIL: Joi.string()
      .default('admin@example.com')
      .description('Admin registration email'),
    BCRYPT_SALT_ROUNDS: Joi.number()
      .default(15)
      .description('Bcrypt salt rounds'),
    JWT_ISSUER: Joi.string().required().description('JWT issuer'),
    JWT_ACCESS_SECRET: Joi.string()
      .required()
      .description('JWT access token secret'),
    JWT_REFRESH_SECRET: Joi.string()
      .required()
      .description('JWT refresh token secret'),
    JWT_RESET_PASSWORD_SECRET: Joi.string()
      .required()
      .description('JWT reset password token secret'),
    JWT_VERIFY_EMAIL_SECRET: Joi.string()
      .required()
      .description('JWT verify email token secret'),
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
    TWILIO_ACCOUNT_SID: Joi.string().description('twilio account id'),
    TWILIO_AUTH_TOKEN: Joi.string().description('twilio account auth token'),
    TWILIO_NUMBER: Joi.string().description('twilio phone number'),
    CLOUD_NAME: Joi.string().description('cloud name'),
    CLOUDINARY_API_KEY: Joi.string().description('cloudinary api key'),
    CLOUDINARY_API_SECRET: Joi.string().description('cloudinary api secret'),
  })
  .unknown();

// validations
const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

// error handler
if (error) {
  throw new Error(`Config Validation Error: ${error.message}`);
}

// Module exports
module.exports = {
  port: envVars.PORT,
  host: envVars.HOST,
  env: envVars.NODE_ENV,
  appName: envVars.APP_NAME,
  mongodbUrl: envVars.MONGODB_URL,
  adminEmail: envVars.ADMIN_EMAIL,
  bcryptSaltRounds: envVars.BCRYPT_SALT_ROUNDS,
  jwt: {
    issuer: envVars.JWT_ISSUER,
    accessSecret: envVars.JWT_ACCESS_SECRET,
    refreshSecret: envVars.JWT_REFRESH_SECRET,
    resetPasswordSecret: envVars.JWT_RESET_PASSWORD_SECRET,
    verifyEmailSecret: envVars.JWT_VERIFY_EMAIL_SECRET,
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
  twilio: {
    accountSid: envVars.TWILIO_ACCOUNT_SID,
    authToken: envVars.TWILIO_AUTH_TOKEN,
    phoneNumber: envVars.TWILIO_NUMBER,
  },
  cloudinary: {
    cloudName: envVars.CLOUD_NAME,
    apiKey: envVars.CLOUDINARY_API_KEY,
    apiSecret: envVars.CLOUDINARY_API_SECRET,
  },
};
