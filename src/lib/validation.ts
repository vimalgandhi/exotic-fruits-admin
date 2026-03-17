// Zod schemas for form validation
import { z } from 'zod';
export const userSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(6),
});