// Module exports from lib folder
module.exports.SuccessResponse = require('./lib/SuccessResponse');
module.exports.ErrorResponse = require('./lib/ErrorResponse');
module.exports.cleanedObject = require('./lib/cleanedObject');
module.exports.removeUndefined = require('./lib/removeUndefined');
module.exports.queryStringify = require('./lib/queryStringify');
module.exports.mappedMetadata = require('./lib/mappedMetadata');
module.exports.mappedDocuments = require('./lib/mappedDocuments');
module.exports.mappedPermissions = require('./lib/mappedPermissions');

// Module exports from current folder
module.exports.uploader = require('./uploader');
module.exports.cloudinaryUploader = require('./cloudinaryUploader');
module.exports.sendTokenResponse = require('./sendTokenResponse');
module.exports.sendMetadataResponse = require('./sendMetadataResponse');
