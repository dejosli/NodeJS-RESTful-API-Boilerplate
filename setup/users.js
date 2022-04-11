// Internal module imports
const logger = require('../src/config/logger');
const users = require('./_data/users.json');
const User = require('../src/api/models/User');

const seedUsers = async () => {
  await Promise.all(
    users.map(async (user) => {
      // checking whether user exists or not
      const userExists = await User.findByEmail(user.email);
      if (!userExists) {
        const savedUser = await User.create(user);
        logger.info(`Saved user id: ${savedUser._id}`);
      } else {
        logger.warn(`User ${user.email} already exists`);
      }
    })
  );
  logger.info(`Seeding users finished`);
};

const dropUsers = async () => {
  try {
    await User.collection.drop();
    logger.info('User collection dropped');
  } catch (err) {
    logger.error('User collection drop failed');
  }
};

// Module exports
module.exports = { seedUsers, dropUsers };
