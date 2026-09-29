// Centralized Express error handler — must be registered last, after all routes.
// Every controller can now just throw (AppError for expected cases, anything
// else for bugs) and let this format the response instead of repeating
// try/catch + res.status(500).json(...) everywhere.
const errorHandler = (err, req, res, next) => {
  // eslint-disable-next-line no-unused-vars
  void next;

  const statusCode = err.statusCode && err.isOperational ? err.statusCode : 500;
  const message = err.isOperational ? err.message : 'Server error';

  // Full detail server-side only — never leak internals (stack traces,
  // driver error messages, etc.) to the client.
  console.error(`[error] ${req.method} ${req.originalUrl} ->`, err);

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
