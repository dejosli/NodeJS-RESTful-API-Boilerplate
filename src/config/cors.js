const whitelist = ['http://localhost:3000', 'http://localhost:1337'];

const corsOptions = {
  origin: false,
  optionsSuccessStatus: 200,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

const corsOptionsDelegate = function (req, callback) {
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions.origin = true; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions.origin = false; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};

module.exports = corsOptionsDelegate;
