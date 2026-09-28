// Catches any request that didn't match a route, so unknown endpoints get a
// clean 404 instead of Express's default HTML error page.
const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

module.exports = notFound;
