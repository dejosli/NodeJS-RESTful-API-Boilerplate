// Internal module imports
const { uploader } = require('../../utils');

const profilePicUpload = (req, res, next) => {
  uploader.singleFileUpload('profilePicture', {
    subdirectory: '/photos/avatar',
    allowedMimeTypes: [
      {
        field: 'profilePicture',
        types: ['image/jpeg', 'image/png'],
        message: 'Only .jpg, .jpeg or .png format allowed!',
      },
    ],
    maxFileSize: 3145728, // 3 MB
  })(req, res, next);
};

// Module exports
module.exports = profilePicUpload;
