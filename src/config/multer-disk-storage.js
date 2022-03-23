// External module imports
const path = require('path');
const fs = require('fs-extra');
const multer = require('multer');
const mongoose = require('mongoose');

// file upload directory
const UPLOAD_DIR = path.join(__dirname, '../../public/uploads');

// define storage
const storage = (subdirectory) => {
  return multer.diskStorage({
    destination(req, file, cb) {
      const dest = `${UPLOAD_DIR}${subdirectory}`;
      fs.mkdirsSync(dest);
      cb(null, dest);
    },

    filename(req, file, cb) {
      const extension = path.extname(file.originalname);
      const uniquePrefix = new mongoose.Types.ObjectId().toHexString();
      const fileName = `${uniquePrefix}${extension}`;
      cb(null, fileName);
    },
  });
};

// Module exports
module.exports = storage;
