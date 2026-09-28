/**
 * Operational error with an HTTP status code attached.
 * Throw this from controllers for expected failure cases (not found, forbidden, etc.)
 * — the centralized error handler sends `message` to the client as-is.
 * Anything else thrown (a driver error, a programming bug) is treated as
 * unexpected and never leaks its message to the client.
 */
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
