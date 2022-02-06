// External module imports
const AccessControl = require('accesscontrol');

// Internal module imports
const { allRoles } = require('../config/roles');
const { permissionObject } = require('../utils');
const grantAccess = require('../middlewares/grantAccess');
const asyncHandler = require('../middlewares/common/asyncHandler');
const { authService } = require('../services');

// init access-control
const roleRights = new AccessControl();

/**
 * Define Resources
 */
const resourceTypes = {
  USER: {
    value: 'users',
    attributes: ['*'],
  },
};

/**
 * Define roles and grants one by one
 */

// user role permissions
roleRights
  .grant(allRoles.USER.value)
  .readOwn(resourceTypes.USER.value)
  .updateOwn(resourceTypes.USER.value)
  .deleteOwn(resourceTypes.USER.value);

// admin role inherits both user and editor role permissions
roleRights
  .grant([allRoles.ADMIN.value, allRoles.EDITOR.value])
  .extend(allRoles.USER.value)
  .readAny(resourceTypes.USER.value)
  .updateAny(resourceTypes.USER.value)
  .deleteAny(resourceTypes.USER.value);

/**
 * Define action rules for the permission
 */

const grantRules = function (...actions) {
  return asyncHandler(async (req, res, next) => {
    const [readAny, readOwn] = actions; // array destructuring
    let hasPermission;
    let hasRoleAccess = false;
    // check whether loggedIn user itself
    if (req.user.id === req.params.userId) {
      hasPermission = roleRights
        .can(req.user.role)
        [readOwn](resourceTypes.USER.value);
      hasRoleAccess = true;
    } else {
      hasPermission = roleRights
        .can(req.user.role)
        [readAny](resourceTypes.USER.value);
      const user = await authService.getUser(req.params.userId);
      hasRoleAccess = allRoles[req.user.role].level > allRoles[user.role].level;
      req.user = user;
    }
    // check whether loggedIn user is allowed to access
    if (hasPermission.granted && hasRoleAccess) {
      permissionObject.allow = true;
      permissionObject.attributes = hasPermission.attributes;
      permissionObject.resource = resourceTypes.USER.value;
      req.permission = permissionObject;
    }
    next();
  });
};

// chain middleware
const authorizeUsersReadRules = [grantRules('readAny', 'readOwn'), grantAccess];
const authorizeUsersUpdateRules = [
  grantRules('updateAny', 'updateOwn'),
  grantAccess,
];
const authorizeUsersDeleteRules = [
  grantRules('deleteAny', 'deleteOwn'),
  grantAccess,
];

// Module exports
module.exports = {
  authorizeUsersReadRules,
  authorizeUsersUpdateRules,
  authorizeUsersDeleteRules,
};
