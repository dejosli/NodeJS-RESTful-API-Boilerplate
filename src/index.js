// External module imports
const http = require('http');

// Internal module imports
const app = require('./app');
const config = require('./config/config');

// init server
const server = http.createServer(app);
server.listen(config.port, () => {
  console.log(`listening on port ${config.port}`);
});
