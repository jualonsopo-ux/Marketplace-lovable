import { z } from 'zod';

/**
 * Utility functions for data validation and transformation
 */

// Generic validation function
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.issues);
      throw new Error(`Validation failed: ${error.issues.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
}

// Safe validation that returns success/error result
export function safeValidateData<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  error?: string;
} {
  try {
    const result = schema.safeParse(data);
    if (result.success) {
      return { success: true, data: result.data };
    } else {
      return { 
        success: false, 
        error: result.error.issues.map(e => e.message).join(', ') 
      };
    }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown validation error' 
    };
  }
}

// Transform legacy Coach data to new CoachProfile + User structure
export function transformLegacyCoachData(legacyCoach: any) {
  // This will be used when migrating from legacy format to new schemas
  const [firstName, ...lastNameParts] = legacyCoach.name.split(' ');
  
  return {
    user: {
      id: `user-${legacyCoach.id}`,
      first_name: firstName,
      last_name: lastNameParts.join(' '),
      email: `${legacyCoach.handle}@coachwave.com`,
      profile_image: legacyCoach.avatar,
      role: legacyCoach.role === 'Coach' ? 'coach' : 'coach',
      status: 'active',
      language: legacyCoach.languages?.[0] || 'es',
      timezone: 'Europe/Madrid',
      email_notifications: true,
      push_notifications: true,
      marketing_emails: false,
      created_at: new Date(),
      updated_at: new Date(),
    },
    coach: {
      id: legacyCoach.id,
      user_id: `user-${legacyCoach.id}`,
      title: legacyCoach.headline,
      bio: legacyCoach.bio,
      years_experience: 5, // Default
      specializations: legacyCoach.specialties,
      hourly_rate: parseInt(legacyCoach.priceHintS1?.replace('€', '') || '50'),
      currency: 'EUR' as const,
      timezone: 'Europe/Madrid',
      total_sessions: 0,
      average_rating: legacyCoach.rating,
      total_reviews: legacyCoach.reviewsCount,
      response_time_hours: 24,
      instant_booking: false,
      languages: legacyCoach.languages || ['es'],
      coaching_methods: ['video'] as const,
      verification_status: 'verified' as const,
      is_featured: legacyCoach.badges?.includes('⭐ Top') || false,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    }
  };
}

// Generate UUID (simple version for mock data)
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}