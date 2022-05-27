// Internal module imports
const { connectDB } = require('../src/core/database');
const logger = require('../src/config/logger');
const { seedUsers, dropUsers } = require('./users');

// insert data into database
const seed = async () => {
  try {
    // connect to the database
    await connectDB();

    // seed users
    await seedUsers();

    logger.info('Seed finished');
    // exit process
    process.exit(0);
  } catch (error) {
    logger.error(error);
    process.exit(0);
  }
};

// delete data from database
const drop = async () => {
  try {
    // connect to the database
    await connectDB();

    // drop users collection
    await dropUsers();

    logger.info('Dropping finished');
    // exit process
    process.exit(0);
  } catch (error) {
    logger.error(error);
    process.exit(0);
  }
};

if (process.argv[2] === '-i') {
  logger.info('Seed starting');
  seed();
} else if (process.argv[2] === '-r') {
  logger.info('Start dropping');
  drop();
}
