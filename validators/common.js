const { z } = require('zod');

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');

// Builds a req.params schema for a single :paramName that must be a Mongo ObjectId.
const objectIdParamSchema = (paramName) => z.object({ [paramName]: objectId });

module.exports = { objectId, objectIdParamSchema };
