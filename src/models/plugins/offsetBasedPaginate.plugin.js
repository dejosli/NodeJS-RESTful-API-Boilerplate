/* eslint-disable no-param-reassign */

// Internal module imports
const { cleanedObject } = require('../../utils');

/**
 * Default options having properties
 * @property docs {Array} - Array of documents
 * @property totalDocs {Number} - Total number of documents that match a query
 * @property limit {Number} - Limit that was used
 * @property page {Number} - Current page number
 * @property totalPages {Number} - Total number of pages
 * @property offset {Number} - Only if specified or default page/offset values were used
 * @property hasPrevPage {Boolean} - Availability of prev page
 * @property hasNextPage {Boolean} - Availability of next page
 * @property prevPage {Number} - Previous page number if available or NULL
 * @property nextPage {Number} - Next page number if available or NULL
 * @property pageCounter {Number} - The starting sl. number of first document
 * @property meta {Object} - Object of pagination meta data (Default: false)
 * @property countQuery {Object} - Aggregate Query used to count the resultant documents. Can be used for bigger queries. (Default: aggregate-query)
 * @property pagination {Boolean} - If pagination is set to false, it will return all docs without adding limit condition. (Default: True)
 * @property customLabels {Object} - Developers can provide custom labels for manipulating the response data.
 * @property allowDiskUse {Boolean} - To enable diskUse for bigger queries. (Default: False)
 * @property sortBy {Object} - Sort order
 */
const defaultOptions = {
  customLabels: {
    page: 'page',
    limit: 'limit',
    docs: 'docs',
    totalDocs: 'totalDocs',
    totalPages: 'totalPages',
    nextPage: 'nextPage',
    prevPage: 'prevPage',
    pageCounter: 'pageCounter',
    hasPrevPage: 'hasPrevPage',
    hasNextPage: 'hasNextPage',
  },
  limit: 20,
  // sortBy: { createdAt: -1 },
  sortBy: null,
  meta: false,
  countQuery: { $match: {} },
  pagination: true,
  allowDiskUse: false,
};

const offsetBasedPaginate = (schema) => {
  /**
   * Mongoose Aggregate Paginate
   * @param  {Aggregate} pipeline
   * @param  {Object} options
   * @returns {Promise<Object>}
   */
  schema.statics.offsetPaginate = async function (pipeline, options) {
    pipeline = Array.isArray(pipeline) ? pipeline : [];

    // remove undefined properties from objects
    options = cleanedObject(options);
    options = {
      ...defaultOptions,
      ...options,
    };

    const customLabels = {
      ...defaultOptions.customLabels,
      ...options.customLabels,
    };

    // Custom Labels
    const labelDocs = customLabels.docs;
    const labelTotalDocs = customLabels.totalDocs;
    const labelPage = customLabels.page;
    const labelLimit = customLabels.limit;
    const labelTotalPages = customLabels.totalPages;
    const labelNextPage = customLabels.nextPage;
    const labelPrevPage = customLabels.prevPage;
    const labelHasNextPage = customLabels.hasNextPage;
    const labelHasPrevPage = customLabels.hasPrevPage;
    const labelPageCounter = customLabels.pageCounter;

    const maxLimit = 100;

    // default pagination based on page
    let docs;
    let totalCount;
    let offset = 0;
    let page = 1;
    let skip = offset;

    const limit =
      parseInt(options.limit, 10) > 0 && parseInt(options.limit, 10) < maxLimit
        ? parseInt(options.limit, 10)
        : defaultOptions.limit;
    const sortBy =
      typeof options.sortBy === 'object' &&
      Object.keys(options.sortBy).length > 0
        ? options.sortBy
        : defaultOptions.sortBy;

    let pageCounter = (page - 1) * limit + 1;

    if (Object.prototype.hasOwnProperty.call(options, 'offset')) {
      offset = Math.abs(parseInt(options.offset, 10));
      page = Math.ceil((offset + 1) / limit);
      skip = offset;
      pageCounter = offset + 1;
    }

    if (Object.prototype.hasOwnProperty.call(options, 'page')) {
      page = Math.abs(parseInt(options.page || 1, 10)) || 1;
      skip = (page - 1) * limit;
      pageCounter = (page - 1) * limit + 1;
    }

    const allowDiskUse = !!options.allowDiskUse;
    const isPaginationEnabled = !!options.pagination;
    const isIncludeMeta = !!(
      options.meta && String(options.meta).toLowerCase() === 'true'
    );

    const countQuery =
      typeof options.countQuery === 'object' &&
      Object.keys(options.countQuery).length > 0
        ? options.countQuery
        : defaultOptions.countQuery;

    // aggregate promises
    const aggregateQuery = this.aggregate(pipeline, {
      allowDiskUse,
    });
    const aggregateCountQuery = this.aggregate(
      [
        countQuery,
        {
          $count: 'totalDocs',
        },
      ],
      {
        allowDiskUse,
      }
    );

    if (sortBy) {
      // chain to aggregate promise
      aggregateQuery.sort(sortBy);
    }

    if (isPaginationEnabled) {
      // chain to aggregate promise
      aggregateQuery.skip(skip).limit(limit);

      // resolve aggregate promises in parallel
      [docs, totalCount] = await Promise.all([
        aggregateQuery,
        aggregateCountQuery,
      ]).then((results) => {
        return Promise.resolve(results);
      });
    } else {
      docs = await aggregateQuery;
    }

    if (isIncludeMeta && isPaginationEnabled) {
      const totalDocs = totalCount[0]?.totalDocs || 0;
      const totalPages = Math.ceil(totalDocs / limit) || 1;

      let prevPage = null;
      let nextPage = null;
      let hasPrevPage = false;
      let hasNextPage = false;

      // Set prev page
      if (page > 1) {
        hasPrevPage = true;
        prevPage = page - 1;
      }
      // Set next page
      if (page < totalPages) {
        hasNextPage = true;
        nextPage = page + 1;
      }

      // metadata object
      const meta = {
        [labelDocs]: docs,
        [labelPage]: page,
        [labelLimit]: limit,
        [labelTotalDocs]: totalDocs,
        [labelTotalPages]: totalPages,
        [labelPrevPage]: prevPage,
        [labelNextPage]: nextPage,
        [labelHasPrevPage]: hasPrevPage,
        [labelHasNextPage]: hasNextPage,
        [labelPageCounter]: totalDocs ? pageCounter : null,
      };
      return meta;
    }
    return { docs };
  };
};

// Module exports
module.exports = offsetBasedPaginate;
