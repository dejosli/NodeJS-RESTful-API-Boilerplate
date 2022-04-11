/**
 * Create a permission object
 * @param {boolean} allow
 * @param {string} resource
 * @param {Array<string>} attributes
 * @return {object} permission object
 */
const mappedPermissions = (
  allow = false,
  resource = null,
  attributes = ['*']
) => {
  return { allow, resource, attributes };
};

// Module exports
module.exports = mappedPermissions;
