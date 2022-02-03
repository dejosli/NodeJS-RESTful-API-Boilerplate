// External module imports
const LocalStrategy = require('passport-local').Strategy;
const { Strategy, ExtractJwt } = require('passport-jwt');

// Internal module imports
const config = require('./config');
const { User, Token } = require('../models/index');
const { tokenTypes } = require('./tokens');

// passport local-strategy fields
const localOptions = {
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
};

// implementation of passport local-strategy
const localStrategy = new LocalStrategy(
  localOptions,
  async (req, email, password, done) => {
    try {
      // find user in database
      const user = await User.findOne({ email }).select('+password');
      // if user not found
      if (!user) {
        return done(null, false, { message: 'Wrong email or password' });
      }
      const isMatch = await user.isPasswordMatch(password);
      // if password doesn't match
      if (!isMatch) {
        // if user doesn't exists or password doesn't match
        return done(null, false, { message: 'Wrong email or password' });
      }
      return done(null, user, { message: 'You logged in successfully!' });
    } catch (err) {
      return done(err);
    }
  }
);
const cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies && req.cookies.tokens) {
    // eslint-disable-next-line dot-notation
    token = req.cookies.tokens['access_token'];
  }
  return token;
};

// passport jwt-strategy options
const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    cookieExtractor,
  ]),
  passReqToCallback: true,
};

// implementation of passport jwt-strategy
const jwtStrategy = new Strategy(jwtOptions, async (req, jwtPayload, done) => {
  try {
    // find refresh_token in DB
    const refreshToken = await Token.findToken(jwtPayload.sub);
    // get user from refresh_token
    const { user } = refreshToken;
    // if refresh_token and user exists
    if (refreshToken && user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (err) {
    return done(err, false);
  }
});

// Module exports
module.exports = (passport) => {
  // passport.use(localStrategy);
  passport.use(jwtStrategy);
};
