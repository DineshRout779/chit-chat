const { z } = require('zod');
const { objectId } = require('./common');

const sendMessageSchema = z.object({
  chatId: objectId,
  content: z
    .string()
    .trim()
    .min(1, 'Message content is required')
    .max(2000, 'Message exceeds 2000 characters'),
});

module.exports = { sendMessageSchema };
