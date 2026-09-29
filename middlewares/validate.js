// Validates req[source] (default: body) against a zod schema.
// On success, replaces req[source] with the parsed/coerced data so
// controllers can trust the shape. On failure, responds 400 directly
// (validation failures are a client input problem, not a server error,
// so they don't go through the centralized error handler).
const validate = (schema, source = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[source]);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join('.') || source,
      message: issue.message,
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  req[source] = result.data;
  next();
};

module.exports = validate;
