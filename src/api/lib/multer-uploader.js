// External module imports
const path = require('path');
const fs = require('fs-extra');
const multer = require('multer');

// Internal module imports
const { ErrorResponse } = require('../utils');
const { genUniqueId } = require('../utils').common;
const { httpStatus, httpMessage } = require('../../config/custom-http-status');

// file upload directory
const UPLOAD_DIR = path.join(__dirname, '../../public/uploads');

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
      httpMessage[httpStatus.BAD_REQUEST],
      errors
    )
  );
};

// define multer disk storage
const diskStorage = (folder) => {
  return multer.diskStorage({
    destination(req, file, cb) {
      const dest = `${UPLOAD_DIR}${folder}`;
      fs.mkdirsSync(dest);
      cb(null, dest);
    },

    filename(req, file, cb) {
      const extension = path.extname(file.originalname);
      const uniquePrefix = genUniqueId();
      const fileName = `${uniquePrefix}${extension}`;
      cb(null, fileName);
    },
  });
};

/**
 * Upload files to the specified destination
 * @param {string} folder
 * @param {Array.<object>} allowedMimeTypes
 * @param {number} maxFileSize Max field value size (in bytes)
 * @param {string} errorMessage
 * @return multer object for uploads file
 */
const upload = (
  folder = '/tmp',
  allowedMimeTypes = [],
  maxFileSize = 1048576 // 1 MB
) => {
  // init storage
  const storage = diskStorage(folder);

  // specifying the limits
  const limits = {
    fileSize: maxFileSize,
  };

  // checks which file should be uploaded and which should be skipped
  const fileFilter = (req, file, cb) => {
    let errorMessage = null;

    // if there is no mimetype defined then silently ignore uploads
    if (allowedMimeTypes.length === 0) {
      return cb(null, false);
    }

    // check whether file will be allowed to be uploaded or not
    const isFileAllowed = allowedMimeTypes.every(
      (allowedMimeType) =>
        allowedMimeType.field === file.fieldname &&
        allowedMimeType.types.includes(file.mimetype)
    );

    if (isFileAllowed) {
      return cb(null, true);
    }

    // set error message for not allowed file
    allowedMimeTypes.forEach((allowedMimeType) => {
      if (
        allowedMimeType.field === file.fieldname &&
        !allowedMimeType.types.includes(file.mimetype)
      ) {
        errorMessage = allowedMimeType.message || 'An unknown error occurred';
      }
    });

    // construct error object
    const errors = {
      field: file.fieldname,
      message: errorMessage,
    };

    return cb(errors);
  };

  // return multer object for uploads file
  return multer({ storage, limits, fileFilter });
};

/**
 * Upload a single file with the name fieldname
 * @param {string} fieldName
 * @param {object} options
 * @return pass to next middleware
 */
const uploadSingleFile = (
  fieldName,
  { folder, allowedMimeTypes, maxFileSize }
) => {
  return (req, res, next) => {
    const uploader = upload(folder, allowedMimeTypes, maxFileSize);
    // invoke the middleware function
    uploader.single(fieldName)(req, res, (err) => {
      if (!err) {
        // pass to next middleware
        return next();
      }
      // handle the errors and send the error response
      onErrorHandler(err, next);
    });
  };
};

/**
 * Upload multiple files, all with the name fieldname
 * @param {string} fieldName
 * @param {number} maxCount
 * @param {object} options
 * @return pass to next middleware
 */
const uploadManyFiles = (
  fieldName,
  maxCount,
  { folder, allowedMimeTypes, maxFileSize }
) => {
  return (req, res, next) => {
    const uploader = upload(folder, allowedMimeTypes, maxFileSize);
    // invoke the middleware function
    uploader.array(fieldName, maxCount)(req, res, (err) => {
      if (!err) {
        // pass to next middleware
        return next();
      }
      // handle the errors and send the error response
      onErrorHandler(err, next);
    });
  };
};

/**
 * Upload a mix of files, specified by fields
 * @param {Array<object>} fields
 * @param {object} options
 * @return pass to next middleware
 */
const uploadMixedFiles = (
  fields,
  { folder, allowedMimeTypes, maxFileSize }
) => {
  return (req, res, next) => {
    const uploader = upload(folder, allowedMimeTypes, maxFileSize);
    // invoke the middleware function
    uploader.fields(fields)(req, res, (err) => {
      if (!err) {
        // pass to next middleware
        return next();
      }
      // handle the errors and send the error response
      onErrorHandler(err, next);
    });
  };
};

// Module exports
module.exports = {
  upload,
  uploadSingleFile,
  uploadManyFiles,
  uploadMixedFiles,
};
