// remove undefined field (property) from one-level object
const removeUndefined = (obj) => {
  const newObj = { ...obj };
  Object.keys(newObj).forEach(
    (key) => newObj[key] === undefined && delete newObj[key]
  );
  return newObj;
};

// Module exports
module.exports = removeUndefined;
