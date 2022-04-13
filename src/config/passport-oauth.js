// External module imports
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

// Internal module imports
const config = require('./config');
const { User } = require('../api/models');

// Callback URLs
const GOOGLE_CALLBACK_URL = `http://localhost:5000/api/v1/auth/google/callback`;
const FACEBOOK_CALLBACK_URL = `http://localhost:5000/api/v1/auth/facebook/callback`;

const OAuthOptions = {};
const OAuthStrategy = {};

/**
 * OAuth Strategy Options
 */

OAuthOptions.GOOGLE = {
  clientID: config.google.clientID,
  clientSecret: config.google.clientSecret,
  callbackURL: GOOGLE_CALLBACK_URL,
  //   passReqToCallback: true, // if req (object) need in callback
};

OAuthOptions.FACEBOOK = {
  clientID: config.facebook.clientID,
  clientSecret: config.facebook.clientSecret,
  callbackURL: FACEBOOK_CALLBACK_URL,
  profileFields: ['id', 'name', 'email', 'picture'],
  //   passReqToCallback: true, // if req (object) need in callback
};

/**
 * OAuth Strategy
 */

OAuthStrategy.GOOGLE = new GoogleStrategy(
  OAuthOptions.GOOGLE,
  async (accessToken, refreshToken, profile, done) => {
    const { provider, _json: payload } = profile;
    try {
      // check user in db
      const user = await User.findByEmail(payload.email);
      // if user doesn't exists then create a new user
      if (!user) {
        const username = await User.generateUniqueUsername(payload.given_name);
        const newUser = await User.create({
          name: payload.name,
          username,
          email: payload.email,
          profilePicture: payload.picture,
          isEmailVerified: payload.email_verified,
          OAuthProvider: provider,
          OAuthID: payload.sub,
        });
        return done(null, newUser);
      }
      // user exists but provider does not match
      if (user && user.OAuthProvider !== provider) {
        return done(null, false);
      }
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }
);

OAuthStrategy.FACEBOOK = new FacebookStrategy(
  OAuthOptions.FACEBOOK,
  async (accessToken, refreshToken, profile, done) => {
    const { provider, _json: payload } = profile;
    try {
      // check user in db
      const user = await User.findByEmail(payload.email);
      // if user doesn't exists then create a new user
      if (!user) {
        const name = `${payload.first_name} ${payload.middle_name} ${payload.last_name}`;
        const username = await User.generateUniqueUsername(payload.first_name);
        const newUser = await User.create({
          name,
          username,
          email: payload.email,
          profilePicture: payload.picture.data.url,
          isEmailVerified: true,
          OAuthProvider: provider,
          OAuthID: payload.id,
        });
        return done(null, newUser);
      }
      // user exists but provider does not match
      if (user && user.OAuthProvider !== provider) {
        return done(null, false);
      }
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }
);

// Module exports
module.exports = (passport) => {
  // Register Passport Strategy
  passport.use(OAuthStrategy.GOOGLE);
  passport.use(OAuthStrategy.FACEBOOK);
};
