const { z } = require('zod');

const signupSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must not exceed 20 characters'),

  email: z.string().trim().toLowerCase().email({ message: 'Please provide a valid email' }),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long'),
});

const loginSchema = z.object({
  username: z.string().trim().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

const emailSchema = z.object({
  email: z.string().trim().toLowerCase().email({ message: 'Please provide a valid email' }),
});

const sendOtpSchema = z.object({
  email: z.string().trim().toLowerCase().email({ message: 'Please provide a valid email' }),
  purpose: z.enum(['EMAIL_VERIFICATION', 'PASSWORD_RESET']),
});

const verifyOtpSchema = z.object({
  email: z.string().trim().toLowerCase().email({ message: 'Please provide a valid email' }),
  otp: z.string().length(6, 'OTP must be 6 digits'),
  purpose: z.enum(['EMAIL_VERIFICATION', 'PASSWORD_RESET']).optional(),
});

const resetPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email({ message: 'Please provide a valid email' }),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long'),
});

module.exports = {
  signupSchema,
  loginSchema,
  emailSchema,
  sendOtpSchema,
  verifyOtpSchema,
  resetPasswordSchema,
};
