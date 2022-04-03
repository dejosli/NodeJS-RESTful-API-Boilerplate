// define token types
const tokenTypes = {
  ACCESS: 'access',
  REFRESH: 'refresh',
  RESET_PASSWORD: 'resetPassword',
  VERIFY_EMAIL: 'verifyEmail',
};

// list of types
const types = Object.keys(tokenTypes);

// Module exports
module.exports = {
  tokenTypes,
  types,
};
