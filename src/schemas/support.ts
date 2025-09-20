import { z } from 'zod';

export const CategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(50),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  description: z.string().max(200).optional(),
  icon: z.string().optional(), // Lucide icon name
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  is_active: z.boolean().default(true),
  sort_order: z.number().int().min(0).default(0),
  
  // SEO
  meta_title: z.string().max(60).optional(),
  meta_description: z.string().max(160).optional(),
});

export type Category = z.infer<typeof CategorySchema>;

export const AvailabilityScheduleSchema = z.object({
  id: z.string().uuid(),
  coach_id: z.string().uuid(),
  day_of_week: z.number().int().min(0).max(6), // 0-6 (Sunday-Saturday)
  start_time: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/), // HH:MM format
  end_time: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/), // HH:MM format
  is_active: z.boolean().default(true),
}).refine((data) => data.end_time > data.start_time, {
  message: "End time must be after start time",
  path: ["end_time"],
});

export type AvailabilitySchedule = z.infer<typeof AvailabilityScheduleSchema>;

export const NotificationTypeEnum = z.enum(['session_reminder', 'payment_received', 'new_review', 'system']);

export const NotificationSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  type: NotificationTypeEnum,
  title: z.string().min(1).max(100),
  message: z.string().min(1).max(500),
  data: z.record(z.string(), z.any()).optional(), // JSON para datos adicionales
  is_read: z.boolean().default(false),
  created_at: z.date(),
  read_at: z.date().optional(),
});

export type Notification = z.infer<typeof NotificationSchema>;

export const PaymentSchema = z.object({
  id: z.string().uuid(),
  session_id: z.string().uuid(),
  client_id: z.string().uuid(),
  coach_id: z.string().uuid(),
  
  // Amounts
  gross_amount: z.number().positive(),
  platform_fee: z.number().nonnegative(),
  coach_earnings: z.number().positive(),
  currency: z.enum(['EUR', 'USD', 'GBP']).default('EUR'),
  
  // Payment details
  payment_method: z.enum(['card', 'paypal', 'bank_transfer']),
  payment_provider: z.enum(['stripe', 'paypal']),
  provider_transaction_id: z.string(),
  
  // Status
  status: z.enum(['pending', 'completed', 'failed', 'refunded']),
  
  // Dates
  created_at: z.date(),
  processed_at: z.date().optional(),
  refunded_at: z.date().optional(),
});

export type Payment = z.infer<typeof PaymentSchema>;