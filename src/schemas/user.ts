import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  display_name: z.string().optional(),
  avatar_url: z.string().url().optional(),
  bio: z.string().optional(),
  phone: z.string().optional(),
  role: z.enum(['client', 'coach', 'admin']).default('client'),
  status: z.enum(['active', 'inactive', 'suspended']).default('active'),
  timezone: z.string().default('Europe/Madrid'),
  language: z.enum(['es', 'en']).default('es'),
  email_notifications: z.boolean().default(true),
  push_notifications: z.boolean().default(true),
  marketing_emails: z.boolean().default(false),
  created_at: z.string(),
  updated_at: z.string(),
});

export type User = z.infer<typeof UserSchema>;