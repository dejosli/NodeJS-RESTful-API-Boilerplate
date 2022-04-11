// External module imports
const cors = require('cors');

// allow the following origin
const whitelist = ['http://localhost:3000', 'http://localhost:1337'];

// configuration
const corsOptions = {
  origin: false,
  optionsSuccessStatus: 200,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

// filter the requested origin
const corsOptionsDelegate = (req, callback) => {
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions.origin = true; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions.origin = false; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};

// Module exports
module.exports = cors(corsOptionsDelegate);
