// External module imports
require('module-alias/register');
const AccessControl = require('accesscontrol');

// Internal module imports
const { allRoles } = require('config/roles');
const { mappedPermissions, common } = require('utils');
const { userService } = require('services');
const grantAccess = require('./grantAccess');

const { asyncHandler } = common;

// init access-control
const roleRights = new AccessControl();

/**
 * Define Resources
 */
const resourceTypes = {
  USER: {
    alias: 'users',
    attributes: ['*'],
  },
};

/**
 * Define roles and grants one by one
 */

// user role permissions
roleRights
  .grant(allRoles.USER.alias)
  .readOwn(resourceTypes.USER.alias)
  .updateOwn(resourceTypes.USER.alias)
  .deleteOwn(resourceTypes.USER.alias);

// admin role inherits both user and editor role permissions
roleRights
  .grant([allRoles.ADMIN.alias, allRoles.EDITOR.alias])
  .extend(allRoles.USER.alias)
  .createAny(resourceTypes.USER.alias)
  .readAny(resourceTypes.USER.alias)
  .updateAny(resourceTypes.USER.alias)
  .deleteAny(resourceTypes.USER.alias);

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
        [actionAny](resourceTypes.USER.alias);
      hasRoleAccess = !!hasPermission.granted;
    }

    // if loggedIn user access himself
    if (req.params.userId && req.user.id === req.params.userId) {
      hasPermission = roleRights
        .can(req.user.role)
        [actionOwn](resourceTypes.USER.alias);
      hasRoleAccess = !!hasPermission.granted;
    }

    // if loggedIn user access others
    if (req.params.userId && req.user.id !== req.params.userId) {
      hasPermission = roleRights
        .can(req.user.role)
        [actionAny](resourceTypes.USER.alias);
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
        resourceTypes.USER.alias,
        hasPermission.attributes
      );
    }
    next();
  });
};

const grantUsersCreateRules = asyncHandler(async (req, res, next) => {
  const hasPermission = roleRights
    .can(req.user.role)
    .createAny(resourceTypes.USER.alias);

  const hasRoleAccess =
    allRoles[req.user.role].level > allRoles[req.body?.role]?.level ||
    allRoles[req.user.role].level === allRoles.ADMIN.level;

  // check whether loggedIn user is allowed to access
  if (hasPermission.granted && hasRoleAccess) {
    req.permission = mappedPermissions(
      true,
      resourceTypes.USER.alias,
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
