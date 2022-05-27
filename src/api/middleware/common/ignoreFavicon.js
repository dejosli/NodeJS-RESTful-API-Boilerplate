const ignoreFavicon = (req, res, next) => {
  if (
    req.originalUrl &&
    req.originalUrl.split('/').pop().includes('favicon.ico')
  ) {
    console.log(req.originalUrl.split('/'));
    return res.status(204).end();
  }
  return next();
};

// Module exports
module.exports = ignoreFavicon;
