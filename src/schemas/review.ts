import { z } from 'zod';

export const ReviewSchema = z.object({
  id: z.string().uuid(),
  session_id: z.string().uuid(),
  client_id: z.string().uuid(),
  coach_id: z.string().uuid(),
  
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(10).max(1000).optional(),
  tags: z.array(z.enum(['professional', 'helpful', 'punctual', 'knowledgeable', 'patient'])).max(5).default([]),
  
  is_public: z.boolean().default(true),
  is_verified: z.boolean().default(false),
  
  created_at: z.date(),
  updated_at: z.date(),
});

export type Review = z.infer<typeof ReviewSchema>;

// Form schema para crear review
export const ReviewCreateFormSchema = ReviewSchema.pick({
  rating: true,
  comment: true,
  tags: true,
  is_public: true,
});

export type ReviewCreateForm = z.infer<typeof ReviewCreateFormSchema>;