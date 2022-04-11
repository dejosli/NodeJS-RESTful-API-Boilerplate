/*
 * Title: NodeJS RESTful API Boilerplate
 * Description: Initial file to start the node server and workers
 * Author: Josli Shubho Biswas <bjoslishubho@gmail.com>
 */

// Internal module imports
const { connectDB } = require('./core/database');
const { init: initServer } = require('./core/server');
const { init: initWorkers } = require('./core/workers');

const start = async () => {
  // database connection
  await connectDB();

  // start the server
  await initServer();

  // start the workers
  await initWorkers();
};

start();
