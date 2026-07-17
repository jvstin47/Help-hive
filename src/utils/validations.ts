import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  fullName: z.string().min(2, 'Full name is required.'),
  role: z.enum(['requester', 'volunteer'], { message: 'Please select a role.' }),
  phone: z.string().optional(),
});
