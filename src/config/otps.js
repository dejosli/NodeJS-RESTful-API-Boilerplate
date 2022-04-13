// define verification methods
const verificationMethods = {
  SMS: 'sms',
  EMAIL: 'email',
  GOOGLE_AUTHENTICATOR: 'google-authenticator',
};

// list of methods
const methods = Object.values(verificationMethods);

// Module exports
module.exports = {
  methods,
  verificationMethods,
};
