// External module imports
const httpStatus = require('http-status');

// Internal module imports
const SuccessResponse = require('./lib/SuccessResponse');

/**
 * Set response headers and send metadata as response
 * @param {object.<Response>} res
 * @param {Array.<object>} users
 * @param {object} metadata
 * @param {boolean} isIncludeMetadata
 * @return send response to client
 */
const sendMetadataResponse = (
  res,
  users,
  metadata,
  isIncludeMetadata = false
) => {
  // set response headers
  res.header('X-Total-Count', metadata.totalDocs);
  res.header('X-Total-Pages', metadata.totalPages);
  res.links(metadata.links);

  // send response with metadata
  if (isIncludeMetadata) {
    return res
      .status(httpStatus.OK)
      .json(
        new SuccessResponse(
          httpStatus.OK,
          httpStatus[httpStatus.OK],
          { users },
          { ...metadata }
        )
      );
  }
  // send response without metadata
  return res
    .status(httpStatus.OK)
    .json(
      new SuccessResponse(httpStatus.OK, httpStatus[httpStatus.OK], { users })
    );
};

// Module exports
module.exports = sendMetadataResponse;
