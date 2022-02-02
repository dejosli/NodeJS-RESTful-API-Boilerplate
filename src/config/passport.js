// External module imports
const LocalStrategy = require('passport-local').Strategy;
const { Strategy, ExtractJwt } = require('passport-jwt');

// Internal module imports
const config = require('./config');
const { User } = require('../models/index');

// passport local-strategy fields
const localOptions = {
  usernameField: 'email',
  passwordField: 'password',
};

// implementation of passport local-strategy
const localStrategy = new LocalStrategy(
  localOptions,
  async (email, password, done) => {
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

// passport jwt-strategy options
const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

// implementation of passport jwt-strategy
const jwtStrategy = new Strategy(jwtOptions, async (jwtPayload, done) => {
  try {
    // find user in database
    const user = await User.findById(jwtPayload.sub);
    // if user not found
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
});

// Module exports
module.exports = (passport) => {
  // passport.use(localStrategy);
  passport.use(jwtStrategy);
};
