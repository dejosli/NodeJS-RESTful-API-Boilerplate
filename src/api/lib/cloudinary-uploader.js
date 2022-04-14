// External module imports
require('module-alias/register');
const path = require('path');
const fs = require('fs-extra');

// Internal module imports
const cloudinary = require('config/cloudinary');
const { httpMessage } = require('config/custom-http-status');

/**
 * Create cloudinary public_id
 * @param {string} filePath
 * @return {string}
 */
const parsePublicId = (filePath) => {
  const filename = path.parse(filePath).name;
  const folder = path.dirname(filePath).split('/').pop();

  // make uploaded file id
  const publicId = `${folder}/${filename}`;
  return publicId;
};

/**
 * Upload single file to cloudinary
 * @param {string} file full path of the uploaded file
 * @param {object} options cloudinary options object
 * @return {Promise<object>} a new promise
 */
const uploadSingleFile = async (file, options) => {
  try {
    // upload file to cloudinary server
    const result = await cloudinary.uploader.upload(file, options);
    // remove file from local storage
    fs.removeSync(file);
    return result;
  } catch (err) {
    // remove file from local storage
    fs.removeSync(file);
    throw new Error(httpMessage.CLOUDINARY_FILE_UPLOAD_ERROR);
  }
};

/**
 * Upload multiple files to cloudinary
 * @param {Array.<string>} files array of full path of the uploaded files
 * @param {object} options cloudinary options object
 * @return {Promise<object>} a new promise
 */
const uploadManyFiles = async (files, options) => {
  try {
    const uploaderPromises = files.map((file) => {
      // upload file to cloudinary server
      return uploadSingleFile(file, options);
    });
    const results = await Promise.all(uploaderPromises);
    return results;
  } catch (err) {
    throw new Error(httpMessage.CLOUDINARY_FILE_UPLOAD_ERROR);
  }
};

/**
 * Remove single file from cloudinary
 * @param {string} file full path of the uploaded file
 * @param {object} options cloudinary options object
 * @return {Promise<object>} a new promise
 */
const deleteSingleFile = async (file, options) => {
  try {
    // make uploaded file id
    const publicId = parsePublicId(file);

    // delete file from cloudinary server
    const result = await cloudinary.uploader.destroy(publicId, options);
    return result;
  } catch (err) {
    throw new Error(httpMessage.CLOUDINARY_FILE_DELETE_ERROR);
  }
};

/**
 * Remove multiple files from cloudinary
 * @param {string} files array of full path of the uploaded file
 * @param {object} options cloudinary options object
 * @return {Promise<object>} a new promise
 */
const deleteManyFiles = async (files, options) => {
  try {
    const uploaderPromises = files.map((file) => {
      // delete file from cloudinary server
      return deleteSingleFile(file, options);
    });
    const results = await Promise.all(uploaderPromises);
    return results;
  } catch (err) {
    throw new Error(httpMessage.CLOUDINARY_FILE_DELETE_ERROR);
  }
};

/**
 * Update uploaded file in cloudinary
 * @param {string} oldFile full path of the uploaded file
 * @param {string} newFile full path of the uploaded file
 * @param {object} newOptions cloudinary options object
 * @return {Promise<object>} a new promise
 */
const updateFile = async (oldFile, newFile, newOptions) => {
  try {
    // delete old file
    await deleteSingleFile(oldFile);

    // upload new file
    const result = await uploadSingleFile(newFile, newOptions);
    return result;
  } catch (err) {
    throw new Error(httpMessage.CLOUDINARY_FILE_UPDATE_ERROR);
  }
};

/**
 * Upload single file to cloudinary as stream
 * @param {string} file full path of the uploaded file
 * @param {object} options cloudinary options object
 * @return {Promise<object>} a new promise
 */
const uploadSingleFileStream = (file, options) => {
  return new Promise((resolve, reject) => {
    // create writeable stream
    const writeStream = cloudinary.uploader.upload_stream(
      options,
      (err, result) => {
        if (err) {
          // remove file from local storage
          fs.removeSync(file);
          return reject(new Error(httpMessage.CLOUDINARY_FILE_UPLOAD_ERROR));
        }
        // remove file from local storage
        fs.removeSync(file);
        return resolve(result);
      }
    );
    // create file into binary stream and upload to server
    fs.createReadStream(file).pipe(writeStream);
  });
};

/**
 * Upload multiple files to cloudinary as stream
 * @param {Array.<string>} files array of full path of the uploaded files
 * @param {object} options cloudinary options object
 * @return {Promise<object>} a new promise
 */
const uploadManyFilesStream = async (files, options) => {
  try {
    const uploaderPromises = files.map((file) => {
      // upload file to cloudinary server
      return uploadSingleFileStream(file, options);
    });
    const results = await Promise.all(uploaderPromises);
    return results;
  } catch (err) {
    throw new Error(httpMessage.CLOUDINARY_FILE_UPLOAD_ERROR);
  }
};

/**
 * Update uploaded file in cloudinary as stream
 * @param {string} oldFile full path of the uploaded file
 * @param {string} newFile full path of the uploaded file
 * @param {object} newOptions cloudinary options object
 * @return {Promise<object>} a new promise
 */
const updateFileStream = async (oldFile, newFile, newOptions) => {
  try {
    // delete old file
    await deleteSingleFile(oldFile);

    // upload new file
    const result = await uploadSingleFileStream(newFile, newOptions);
    return result;
  } catch (err) {
    throw new Error(httpMessage.CLOUDINARY_FILE_UPDATE_ERROR);
  }
};

// Module exports
module.exports = {
  uploadSingleFile,
  uploadManyFiles,
  deleteSingleFile,
  deleteManyFiles,
  updateFile,
  uploadSingleFileStream,
  uploadManyFilesStream,
  updateFileStream,
};
