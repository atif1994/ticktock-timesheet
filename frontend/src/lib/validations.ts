import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const entrySchema = z.object({
  date: z.string().min(1, 'Date is required'),
  projectName: z.string().min(1, 'Project is required'),
  typeOfWork: z.string().min(1, 'Type of work is required'),
  taskDescription: z.string().min(1, 'Task description is required'),
  hours: z
    .number()
    .min(0.5, 'Minimum 0.5 hours')
    .max(24, 'Maximum 24 hours per day'),
  notes: z.string().optional(),
});

export type EntryInput = z.infer<typeof entrySchema>;
