import { z } from 'zod';

export const CoachingMethodEnum = z.enum(['video', 'phone', 'chat', 'in-person']);
export const VerificationStatusEnum = z.enum(['pending', 'verified', 'rejected']);

export const CoachProfileSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  
  // Información profesional
  title: z.string().min(5).max(100),
  bio: z.string().min(50).max(2000),
  years_experience: z.number().min(0).max(50),
  specializations: z.array(z.string()).min(1).max(10),
  hourly_rate: z.number().positive().max(500),
  currency: z.enum(['EUR', 'USD', 'GBP']).default('EUR'),
  
  // Disponibilidad
  timezone: z.string().default('Europe/Madrid'),
  
  // Métricas (readonly)
  total_sessions: z.number().nonnegative().default(0),
  average_rating: z.number().min(0).max(5).default(0),
  total_reviews: z.number().nonnegative().default(0),
  response_time_hours: z.number().positive().default(24),
  
  // Configuración
  instant_booking: z.boolean().default(false),
  languages: z.array(z.enum(['es', 'en', 'fr', 'de', 'pt'])).min(1),
  coaching_methods: z.array(CoachingMethodEnum).min(1),
  
  // Estado
  verification_status: VerificationStatusEnum.default('pending'),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  
  created_at: z.date(),
  updated_at: z.date(),
});

export type CoachProfile = z.infer<typeof CoachProfileSchema>;

// Extended coach type with user data (for UI components)
export const CoachWithUserSchema = CoachProfileSchema.extend({
  user: z.object({
    first_name: z.string(),
    last_name: z.string(),
    profile_image: z.string().url().optional(),
    email: z.string().email(),
  }),
});

export type CoachWithUser = z.infer<typeof CoachWithUserSchema>;