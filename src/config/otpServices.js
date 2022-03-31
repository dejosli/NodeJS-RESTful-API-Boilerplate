// define service types
const serviceTypes = {
  SMS: 'sms',
  EMAIL: 'email',
  GOOGLE_AUTHENTICATOR: 'google-authenticator',
};

// create an array of service types
const services = Object.values(serviceTypes);

// Module exports
module.exports = {
  services,
  serviceTypes,
};
