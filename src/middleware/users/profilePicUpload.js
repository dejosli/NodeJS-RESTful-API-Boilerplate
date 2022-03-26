// Internal module imports
const { uploader } = require('../../utils');

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
  uploader.uploadSingleFile(fieldName, options)(req, res, next);
};

// Module exports
module.exports = profilePicUpload;
