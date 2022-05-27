// External module imports
const mongoose = require('mongoose');

// Internal module imports
const config = require('../../config/config');
const { httpStatus, httpMessage } = require('../../config/custom-http-status');
const ErrorResponse = require('./ErrorResponse');

// handle async middleware/controller functions
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// handle async functions
const asyncFunction =
  (fn) =>
  async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      throw new ErrorResponse(
        httpStatus.INTERNAL_SERVER_ERROR,
        httpMessage[httpStatus.INTERNAL_SERVER_ERROR]
      );
    }
  };

// convert string to title case
const toTitleCase = (str) => {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => {
      return word.replace(word[0], word[0].toUpperCase());
    })
    .join(' ');
};

// remove undefined field (property) from one-level object
const removeUndefined = (obj) => {
  const newObj = { ...obj };
  Object.keys(newObj).forEach(
    (key) => newObj[key] === undefined && delete newObj[key]
  );
  return newObj;
};

// remove undefined field (property) from nested objects
const cleanedObject = (obj) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] === Object(obj[key])) newObj[key] = cleanedObject(obj[key]);
    else if (obj[key] !== undefined) newObj[key] = obj[key];
  });
  return newObj;
};

// stringify the object
const queryStringify = (object) => {
  return new URLSearchParams(object).toString();
};

// generate unique id
const genUniqueId = () => new mongoose.Types.ObjectId().toHexString();

// create full url
const getFullUrl = (req) =>
  `${req.protocol}://${req.hostname}:${config.port}${req.baseUrl}`;

// Module exports
module.exports = {
  asyncHandler,
  asyncFunction,
  toTitleCase,
  removeUndefined,
  cleanedObject,
  queryStringify,
  genUniqueId,
  getFullUrl,
};
