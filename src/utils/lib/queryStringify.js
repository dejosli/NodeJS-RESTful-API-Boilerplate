const queryStringify = (object) => {
  return new URLSearchParams(object).toString();
};

// Module exports
module.exports = queryStringify;
