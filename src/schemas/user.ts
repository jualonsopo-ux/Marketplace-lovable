import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(['client', 'coach', 'admin']),
  status: z.enum(['active', 'inactive', 'suspended']),
  created_at: z.date(),
  updated_at: z.date(),
  last_login: z.date().optional(),
  
  // Perfil básico
  first_name: z.string().min(1).max(50),
  last_name: z.string().min(1).max(50),
  profile_image: z.string().url().optional(),
  phone: z.string().regex(/^\+?[\d\s-()]+$/).optional(),
  timezone: z.string().default('Europe/Madrid'),
  language: z.enum(['es', 'en']).default('es'),
  
  // Configuraciones
  email_notifications: z.boolean().default(true),
  push_notifications: z.boolean().default(true),
  marketing_emails: z.boolean().default(false),
});

export type User = z.infer<typeof UserSchema>;