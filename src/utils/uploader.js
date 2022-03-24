// External module imports
const httpStatus = require('http-status');
const multer = require('multer');

// Internal module imports
const ErrorResponse = require('./ErrorResponse');
const diskStorage = require('../config/multer-disk-storage');

const mappedErrors = (err) => {
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    // eslint-disable-next-line no-param-reassign
    err.message = 'Invalid field or too many files';
  }
  // create error object
  const errors = {
    [err.field]: {
      msg: err.message,
      param: err.field,
      location: 'file',
    },
  };
  return errors;
};

const onErrorHandler = (err, next) => {
  const errors = mappedErrors(err);
  // pass the errors to next
  return next(
    new ErrorResponse(
      httpStatus.BAD_REQUEST,
      httpStatus[httpStatus.BAD_REQUEST],
      errors
    )
  );
};

/**
 * Upload files to the specified destination
 * @param {string} subdirectory
 * @param {Array.<object>} allowedMimeTypes
 * @param {number} maxFileSize Max field value size (in bytes)
 * @param {string} errorMessage
 */
const fileUpload = (
  subdirectory = '/tmp',
  allowedMimeTypes = [],
  maxFileSize = 1048576 // 1 MB
) => {
  // init storage
  const storage = diskStorage(subdirectory);

  // specifying the limits
  const limits = {
    fileSize: maxFileSize,
  };

  // checks which file should be uploaded and which should be skipped
  const fileFilter = (req, file, cb) => {
    let errorMessage;

    if (allowedMimeTypes.length === 0) {
      return cb(null, false);
    }

    const isFileAllowed = allowedMimeTypes.every(
      (allowedMimeType) =>
        allowedMimeType.field === file.fieldname &&
        allowedMimeType.types.includes(file.mimetype)
    );
    if (isFileAllowed) {
      return cb(null, true);
    }

    allowedMimeTypes.forEach((allowedMimeType) => {
      if (
        allowedMimeType.field === file.fieldname &&
        !allowedMimeType.types.includes(file.mimetype)
      ) {
        errorMessage = allowedMimeType.message || 'An unknown error occurred';
      }
    });

    // create error object
    const errors = {
      field: file.fieldname,
      message: errorMessage,
    };
    return cb(errors);
  };

  // return multer upload object
  return multer({ storage, limits, fileFilter });
};

/**
 * Upload a single file with the name fieldname
 * @param {string} fieldName
 * @param {object} options
 */
const singleFileUpload = (
  fieldName,
  { subdirectory, allowedMimeTypes, maxFileSize }
) => {
  return (req, res, next) => {
    const upload = fileUpload(subdirectory, allowedMimeTypes, maxFileSize);
    // invoke the middleware function
    upload.single(fieldName)(req, res, (err) => {
      if (!err) {
        return next();
      }
      onErrorHandler(err, next);
    });
  };
};

/**
 * Upload multiple files, all with the name fieldname
 * @param {string} fieldName
 * @param {number} maxCount
 * @param {object} options
 */
const manyFilesUpload = (
  fieldName,
  maxCount,
  { subdirectory, allowedMimeTypes, maxFileSize }
) => {
  return (req, res, next) => {
    const upload = fileUpload(subdirectory, allowedMimeTypes, maxFileSize);
    // invoke the middleware function
    upload.array(fieldName, maxCount)(req, res, (err) => {
      if (!err) {
        return next();
      }
      onErrorHandler(err, next);
    });
  };
};

/**
 * Upload a mix of files, specified by fields
 * @param {Array<object>} fields
 * @param {object} options
 */
const mixedFilesUpload = (
  fields,
  { subdirectory, allowedMimeTypes, maxFileSize }
) => {
  return (req, res, next) => {
    const upload = fileUpload(subdirectory, allowedMimeTypes, maxFileSize);
    // invoke the middleware function
    upload.fields(fields)(req, res, (err) => {
      if (!err) {
        return next();
      }
      onErrorHandler(err, next);
    });
  };
};

// Module exports
module.exports = {
  mappedErrors,
  onErrorHandler,
  fileUpload,
  singleFileUpload,
  manyFilesUpload,
  mixedFilesUpload,
};
