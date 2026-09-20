import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().optional(),
  name: z.string().optional(),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.string().optional(),
  phone: z.string().optional(),
  specialization: z.string().optional(),
  specialty: z.string().optional(),
  hospitalAddress: z.string().optional(),
  hospital: z.string().optional(),
  qualification: z.string().optional(),
  experienceYears: z.any().optional(),
  consultationFee: z.any().optional(),
});