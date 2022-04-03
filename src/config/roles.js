// define roles
const allRoles = {
  ADMIN: {
    value: 'ADMIN',
    level: 300,
  },
  EDITOR: {
    value: 'EDITOR',
    level: 200,
  },
  USER: {
    value: 'USER',
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
