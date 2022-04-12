// define roles
const allRoles = {
  ADMIN: {
    alias: 'ADMIN',
    level: 300, // permission level (higher value priority)
  },
  EDITOR: {
    alias: 'EDITOR',
    level: 200,
  },
  USER: {
    alias: 'USER',
    level: 100,
  },
};

// list of roles
const roles = Object.keys(allRoles);

// Module exports
module.exports = {
  allRoles,
  roles,
};
