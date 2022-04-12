// External module imports
require('module-alias/register');

// Internal module imports
const { multerUploader } = require('lib/multer-uploader');

const profilePicUpload = (req, res, next) => {
  const fieldName = 'profilePicture';
  const options = {
    folder: '/photos/avatar',
    allowedMimeTypes: [
      {
        field: fieldName,
        types: ['image/jpeg', 'image/png'],
        message: 'Only .jpg, .jpeg or .png format allowed!',
      },
    ],
    maxFileSize: 3145728, // 3 MB
  };
  // uploads file to local storage
  multerUploader.uploadSingleFile(fieldName, options)(req, res, next);
};

// Module exports
module.exports = profilePicUpload;
