// External module imports
const { Strategy, ExtractJwt } = require('passport-jwt');
const passport = require('passport');

// Internal module imports
const config = require('./config');
const { Token } = require('../models');
const { tokenTypes } = require('./tokens');

const cookieExtractor = {};
const jwtOptions = {};
const jwtStrategy = {};

/**
 * Custom Extractors
 */
cookieExtractor.ACCESS = function (req) {
  let token = null;
  if (req && req.cookies && req.cookies.tokens) {
    // eslint-disable-next-line dot-notation
    token = req.cookies.tokens['access_token'];
  }
  return token;
};

cookieExtractor.REFRESH = function (req) {
  let token = null;
  if (req && req.cookies && req.cookies.tokens) {
    // eslint-disable-next-line dot-notation
    token = req.cookies.tokens['refresh_token'];
  }
  return token;
};

/**
 * JWT Strategy Options
 */
jwtOptions.ACCESS = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    cookieExtractor.ACCESS,
  ]),
  // passReqToCallback: true, // if req (object) need in callback
};

jwtOptions.REFRESH = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    cookieExtractor.REFRESH,
  ]),
  // passReqToCallback: true, // if req (object) need in callback
};

jwtOptions.RESET_PASSWORD = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
  // passReqToCallback: true, // if req (object) need in callback
};

/**
 * JWT Strategy
 */
jwtStrategy.ACCESS = new Strategy(
  jwtOptions.ACCESS,
  async (jwtPayload, done) => {
    try {
      // check token type
      if (jwtPayload.type === tokenTypes.ACCESS) {
        // find refresh_token in DB
        const refreshTokenDoc = await Token.findToken({
          userId: jwtPayload.sub,
        });
        // get user from refresh_token
        const { user } = refreshTokenDoc;
        // if refresh_token and user exists
        if (refreshTokenDoc && user) {
          return done(null, user);
        }
        return done(null, false);
      }
      return done(null, false);
    } catch (err) {
      return done(err, false);
    }
  }
);

jwtStrategy.REFRESH = new Strategy(
  jwtOptions.REFRESH,
  async (jwtPayload, done) => {
    try {
      // check token type
      if (jwtPayload.type === tokenTypes.REFRESH) {
        // find refresh_token in DB
        const refreshTokenDoc = await Token.findToken({
          userId: jwtPayload.sub,
        });
        // if refresh_token exists
        if (refreshTokenDoc) {
          return done(null, refreshTokenDoc);
        }
        return done(null, false);
      }
      return done(null, false);
    } catch (err) {
      return done(err, false);
    }
  }
);

jwtStrategy.RESET_PASSWORD = new Strategy(
  jwtOptions.RESET_PASSWORD,
  async (jwtPayload, done) => {
    try {
      // check token type
      if (jwtPayload.type === tokenTypes.RESET_PASSWORD) {
        // find resetPasswordToken in DB
        const resetPasswordTokenDoc = await Token.findToken({
          userId: jwtPayload.sub,
          type: tokenTypes.RESET_PASSWORD,
        });
        // if resetPasswordToken exists
        if (resetPasswordTokenDoc) {
          return done(null, resetPasswordTokenDoc);
        }
        return done(null, false);
      }
      return done(null, false);
    } catch (err) {
      return done(err, false);
    }
  }
);

// Register Passport Strategy
passport.use('jwt_access', jwtStrategy.ACCESS);
passport.use('jwt_refresh', jwtStrategy.REFRESH);
passport.use('jwt_resetPassword', jwtStrategy.RESET_PASSWORD);

// Module exports
module.exports = passport;
