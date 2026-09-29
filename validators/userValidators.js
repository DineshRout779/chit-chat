const { z } = require('zod');

const updateUserSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must not exceed 20 characters')
    .optional(),
  profilePic: z.string().trim().url('profilePic must be a valid URL').optional(),
});

module.exports = { updateUserSchema };
