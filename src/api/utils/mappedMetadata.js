/**
 * Create complete url
 * @param {string} url
 * @param {object} object
 * @return complete url
 */
const createLink = (url, object) => {
  const querystring = new URLSearchParams(object).toString();
  return `${url}?${querystring}`;
};

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

  // create link for current page
  const self = createLink(url, {
    ...query,
    page: metadata.page,
    limit: metadata.limit,
  });

  // create link for first page
  const first = createLink(url, {
    ...query,
    page: 1,
    limit: metadata.limit,
  });

  // create link for last page
  const last = createLink(url, {
    ...query,
    page: metadata.totalPages,
    limit: metadata.limit,
  });

  // create link for previous page
  if (metadata.hasPrevPage) {
    prev = createLink(url, {
      ...query,
      page: metadata.prevPage,
      limit: metadata.limit,
    });
  }

  // create link for next page
  if (metadata.hasNextPage) {
    next = createLink(url, {
      ...query,
      page: metadata.nextPage,
      limit: metadata.limit,
    });
  }

  // create links object
  const links = { self, prev, next, first, last };
  return { ...metadata, links };
};

// Module exports
module.exports = mappedMetadata;
