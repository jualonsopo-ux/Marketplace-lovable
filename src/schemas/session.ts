import { z } from 'zod';
import { CoachingMethodEnum } from './coach';

export const SessionStatusEnum = z.enum(['scheduled', 'in_progress', 'completed', 'cancelled', 'no_show']);
export const PaymentStatusEnum = z.enum(['pending', 'paid', 'refunded']);

export const SessionSchema = z.object({
  id: z.string().uuid(),
  coach_id: z.string().uuid(),
  client_id: z.string().uuid(),
  
  // Información de la sesión
  title: z.string().min(3).max(200),
  description: z.string().max(1000).optional(),
  scheduled_start: z.date(),
  scheduled_end: z.date(),
  actual_start: z.date().optional(),
  actual_end: z.date().optional(),
  
  // Configuración
  session_type: CoachingMethodEnum,
  meeting_link: z.string().url().optional(),
  meeting_id: z.string().optional(),
  location: z.string().max(200).optional(),
  
  // Estado y pagos
  status: SessionStatusEnum.default('scheduled'),
  payment_status: PaymentStatusEnum.default('pending'),
  amount: z.number().positive(),
  currency: z.enum(['EUR', 'USD', 'GBP']).default('EUR'),
  
  // Seguimiento
  client_notes: z.string().max(1000).optional(),
  coach_notes: z.string().max(1000).optional(),
  session_recording: z.string().url().optional(),
  
  // Fechas
  created_at: z.date(),
  updated_at: z.date(),
  cancelled_at: z.date().optional(),
  cancellation_reason: z.string().max(500).optional(),
}).refine((data) => data.scheduled_end > data.scheduled_start, {
  message: "End time must be after start time",
  path: ["scheduled_end"],
});

export type Session = z.infer<typeof SessionSchema>;

// Form schemas para React Hook Form
export const SessionCreateFormSchema = SessionSchema.pick({
  title: true,
  description: true,
  scheduled_start: true,
  scheduled_end: true,
  session_type: true,
  location: true,
});

export type SessionCreateForm = z.infer<typeof SessionCreateFormSchema>;