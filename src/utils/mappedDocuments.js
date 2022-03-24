/**
 * Wraps docs with link property
 * @param {Array.<object>} docs
 * @param {string} url
 * @param {string} requestMethod
 * @return {Promise.<Array.<object>>}
 */
const mappedDocuments = (docs, url, requestMethod) => {
  const mappedDocs = docs.map((doc) => {
    return {
      ...doc,
      link: {
        type: requestMethod,
        self: `${url}/${doc.id}`,
      },
    };
  });
  return Promise.resolve(mappedDocs);
};

// Module exports
module.exports = mappedDocuments;
