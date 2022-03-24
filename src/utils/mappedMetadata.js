// Internal module imports
const queryStringify = require('./queryStringify');

/**
 * Wraps metadata with links property
 * @param {object} metadata
 * @param {string} url
 * @param {object} query
 * @return {object} object includes metadata and links
 */
const mappedMetadata = (metadata, url, query) => {
  let prev;
  let next;
  let querystring;

  // create link for current page
  querystring = queryStringify({
    ...query,
    page: metadata.page,
    limit: metadata.limit,
  });
  const self = `${url}?${querystring}`;

  // create link for previous page
  if (metadata.hasPrevPage) {
    querystring = queryStringify({
      ...query,
      page: metadata.prevPage,
      limit: metadata.limit,
    });
    prev = `${url}?${querystring}`;
  }

  // create link for next page
  if (metadata.hasNextPage) {
    querystring = queryStringify({
      ...query,
      page: metadata.nextPage,
      limit: metadata.limit,
    });
    next = `${url}?${querystring}`;
  }

  // create link for first page
  querystring = queryStringify({
    ...query,
    page: 1,
    limit: metadata.limit,
  });
  const first = `${url}?${querystring}`;

  // create link for last page
  querystring = queryStringify({
    ...query,
    page: metadata.totalPages,
    limit: metadata.limit,
  });
  const last = `${url}?${querystring}`;

  // create links object
  const links = { self, prev, next, first, last };
  return { ...metadata, links };
};

// Module exports
module.exports = mappedMetadata;
