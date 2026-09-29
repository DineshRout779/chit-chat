const { z } = require('zod');
const { objectId } = require('./common');

const createChatSchema = z.object({
  selectedUserId: objectId,
});

module.exports = { createChatSchema };
