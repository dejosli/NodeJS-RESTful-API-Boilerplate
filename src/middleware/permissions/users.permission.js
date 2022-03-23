// External module imports
const AccessControl = require('accesscontrol');

// Internal module imports
const { allRoles } = require('../../config/roles');
const { mappedPermissions } = require('../../utils');
const grantAccess = require('./grantAccess');
const asyncHandler = require('../common/asyncHandler');
const { userService } = require('../../services');

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
  .createAny(resourceTypes.USER.value)
  .readAny(resourceTypes.USER.value)
  .updateAny(resourceTypes.USER.value)
  .deleteAny(resourceTypes.USER.value);

/**
 * Define action rules for the permission
 */

const grantRules = function (actionAny, actionOwn) {
  return asyncHandler(async (req, res, next) => {
    let { user } = req;
    let hasPermission;
    let hasRoleAccess = false;

    // if there is no parameters named usedId
    if (!req.params.userId) {
      hasPermission = roleRights
        .can(req.user.role)
        [actionAny](resourceTypes.USER.value);
      hasRoleAccess = !!hasPermission.granted;
    }

    // if loggedIn user access himself
    if (req.params.userId && req.user.id === req.params.userId) {
      hasPermission = roleRights
        .can(req.user.role)
        [actionOwn](resourceTypes.USER.value);
      hasRoleAccess = !!hasPermission.granted;
    }

    // if loggedIn user access others
    if (req.params.userId && req.user.id !== req.params.userId) {
      hasPermission = roleRights
        .can(req.user.role)
        [actionAny](resourceTypes.USER.value);
      if (hasPermission.granted) {
        user = await userService.getUserById(req.params.userId);
        hasRoleAccess =
          allRoles[req.user.role].level > allRoles[user.role].level ||
          allRoles[req.user.role].level === allRoles.ADMIN.level;
      }
    }

    // if loggedIn user updating role
    if (req.params.userId && hasRoleAccess && req.body.role) {
      hasRoleAccess =
        allRoles[req.user.role].level > allRoles[req.body.role].level ||
        allRoles[req.user.role].level === allRoles.ADMIN.level;
    }

    // check whether loggedIn user is allowed to access
    if (hasRoleAccess) {
      req.user = user;
      req.permission = mappedPermissions(
        true,
        resourceTypes.USER.value,
        hasPermission.attributes
      );
    }
    next();
  });
};

const grantUsersCreateRules = asyncHandler(async (req, res, next) => {
  const hasPermission = roleRights
    .can(req.user.role)
    .createAny(resourceTypes.USER.value);

  const hasRoleAccess =
    allRoles[req.user.role].level > allRoles[req.body?.role]?.level ||
    allRoles[req.user.role].level === allRoles.ADMIN.level;

  // check whether loggedIn user is allowed to access
  if (hasPermission.granted && hasRoleAccess) {
    req.permission = mappedPermissions(
      true,
      resourceTypes.USER.value,
      hasPermission.attributes
    );
  }
  next();
});

// chain middleware
const authorizeUsersCreatePermission = [grantUsersCreateRules, grantAccess];

const authorizeUsersReadPermission = [
  grantRules('readAny', 'readOwn'),
  grantAccess,
];
const authorizeUsersUpdatePermission = [
  grantRules('updateAny', 'updateOwn'),
  grantAccess,
];
const authorizeUsersDeletePermission = [
  grantRules('deleteAny', 'deleteOwn'),
  grantAccess,
];

// Module exports
module.exports = {
  authorizeUsersCreatePermission,
  authorizeUsersReadPermission,
  authorizeUsersUpdatePermission,
  authorizeUsersDeletePermission,
};
