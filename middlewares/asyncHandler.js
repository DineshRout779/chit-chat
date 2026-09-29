// Wraps an async route handler so a rejected promise (a thrown error, an
// unhandled DB failure) is forwarded to next(err) instead of crashing the
// process or hanging the request. Lets controllers just `throw` instead of
// repeating try/catch + res.status(500) in every function.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
