/**
 * API service layer - currently using mock data but structured for real API calls
 * When Supabase is connected, these functions will be replaced with actual API calls
 */

import { createMockApiResponse, createMockErrorResponse } from '@/lib/mock-data';
import { validateData, transformLegacyCoachData } from '@/lib/validation';
import { 
  UserSchema, 
  CoachProfileSchema, 
  SessionSchema, 
  ReviewSchema, 
  SessionCreateFormSchema,
  ReviewCreateFormSchema,
  type User, 
  type CoachProfile, 
  type Session, 
  type Review, 
  type SessionCreateForm,
  type ReviewCreateForm,
  type CoachWithUser
} from '@/schemas';
import { coaches, getCoachById, searchCoaches as searchCoachesData } from '@/data/coaches';

// Mock current user
const CURRENT_USER_ID = 'user-maria-lopez';

// ============================================================================
// COACHES API
// ============================================================================

export interface CoachFilters {
  category?: string;
  minRating?: number;
  maxPrice?: number;
  languages?: string[];
  specializations?: string[];
  isActive?: boolean;
  verificationStatus?: string;
  is_featured?: boolean;
  search?: string;
}

export async function fetchCoaches(filters?: CoachFilters): Promise<CoachWithUser[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Use existing search function but transform to new schema
  const searchResults = filters 
    ? searchCoachesData('', filters)
    : coaches;
    
  const transformedCoaches = searchResults.map(coach => {
    const transformed = transformLegacyCoachData(coach);
    return {
      ...transformed.coach,
      coaching_methods: [...transformed.coach.coaching_methods], // Make mutable
      user: transformed.user,
    };
  });
  
  return createMockApiResponse(transformedCoaches);
}

export async function fetchCoach(id: string): Promise<CoachWithUser> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const coach = getCoachById(id);
  if (!coach) {
    throw new Error(`Coach with id ${id} not found`);
  }
  
  const transformed = transformLegacyCoachData(coach);
  return createMockApiResponse({
    ...transformed.coach,
    coaching_methods: [...transformed.coach.coaching_methods], // Make mutable
    user: transformed.user,
  });
}

export async function createCoachProfile(data: Partial<CoachProfile>): Promise<CoachProfile> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newCoach: CoachProfile = {
    id: `coach-${Date.now()}`,
    user_id: CURRENT_USER_ID,
    title: data.title || '',
    bio: data.bio || '',
    years_experience: data.years_experience || 0,
    specializations: data.specializations || [],
    hourly_rate: data.hourly_rate || 50,
    currency: data.currency || 'EUR',
    timezone: data.timezone || 'Europe/Madrid',
    total_sessions: 0,
    average_rating: 0,
    total_reviews: 0,
    response_time_hours: 24,
    instant_booking: data.instant_booking || false,
    languages: data.languages || ['es'],
    coaching_methods: data.coaching_methods || ['video'],
    verification_status: 'pending',
    is_featured: false,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  };
  
  return createMockApiResponse(validateData(CoachProfileSchema, newCoach));
}

export async function updateCoachProfile(id: string, data: Partial<CoachProfile>): Promise<CoachProfile> {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const coach = await fetchCoach(id);
  const updatedCoach = {
    ...coach,
    ...data,
    updated_at: new Date(),
  };
  
  return createMockApiResponse(validateData(CoachProfileSchema, updatedCoach));
}

// ============================================================================
// SESSIONS API
// ============================================================================

export async function fetchSessions(userId: string, role: 'client' | 'coach' = 'client'): Promise<Session[]> {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Mock sessions data
  const mockSessions: Session[] = [
    {
      id: 'session-1',
      coach_id: 'ana-garcia',
      client_id: CURRENT_USER_ID,
      title: 'Sesión de coaching personal',
      description: 'Revisar objetivos profesionales del trimestre',
      scheduled_start: new Date('2024-09-22T10:00:00'),
      scheduled_end: new Date('2024-09-22T11:00:00'),
      session_type: 'video',
      meeting_link: 'https://meet.google.com/abc-def-ghi',
      status: 'scheduled',
      payment_status: 'paid',
      amount: 50,
      currency: 'EUR',
      created_at: new Date('2024-09-20T08:00:00'),
      updated_at: new Date('2024-09-20T08:00:00'),
    },
    {
      id: 'session-2',
      coach_id: 'laura-sanchez',
      client_id: CURRENT_USER_ID,
      title: 'Sesión de hábitos matutinos',
      description: 'Establecer rutina productiva',
      scheduled_start: new Date('2024-09-18T09:00:00'),
      scheduled_end: new Date('2024-09-18T09:30:00'),
      actual_start: new Date('2024-09-18T09:00:00'),
      actual_end: new Date('2024-09-18T09:32:00'),
      session_type: 'video',
      status: 'completed',
      payment_status: 'paid',
      amount: 45,
      currency: 'EUR',
      created_at: new Date('2024-09-15T14:00:00'),
      updated_at: new Date('2024-09-18T09:35:00'),
    }
  ];
  
  // Filter by role
  const filteredSessions = mockSessions.filter(session => 
    role === 'client' ? session.client_id === userId : session.coach_id === userId
  );
  
  return createMockApiResponse(filteredSessions);
}

export async function fetchSession(id: string): Promise<Session> {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const sessions = await fetchSessions(CURRENT_USER_ID);
  const session = sessions.find(s => s.id === id);
  
  if (!session) {
    throw new Error(`Session with id ${id} not found`);
  }
  
  return createMockApiResponse(session);
}

export async function createSession(data: SessionCreateForm & { coach_id: string }): Promise<Session> {
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const newSession: Session = {
    id: `session-${Date.now()}`,
    coach_id: data.coach_id,
    client_id: CURRENT_USER_ID,
    title: data.title,
    description: data.description,
    scheduled_start: data.scheduled_start,
    scheduled_end: data.scheduled_end,
    session_type: data.session_type,
    location: data.location,
    status: 'scheduled',
    payment_status: 'pending',
    amount: 50, // Would be calculated based on coach rate
    currency: 'EUR',
    created_at: new Date(),
    updated_at: new Date(),
  };
  
  return createMockApiResponse(validateData(SessionSchema, newSession));
}

export async function updateSession(id: string, data: Partial<Session>): Promise<Session> {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const session = await fetchSession(id);
  const updatedSession = {
    ...session,
    ...data,
    updated_at: new Date(),
  };
  
  return createMockApiResponse(validateData(SessionSchema, updatedSession));
}

export async function cancelSession(id: string, reason?: string): Promise<Session> {
  return updateSession(id, {
    status: 'cancelled',
    cancelled_at: new Date(),
    cancellation_reason: reason,
  });
}

// ============================================================================
// REVIEWS API
// ============================================================================

export async function fetchReviews(coachId: string): Promise<Review[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock reviews data
  const mockReviews: Review[] = [
    {
      id: 'review-1',
      session_id: 'session-2',
      client_id: CURRENT_USER_ID,
      coach_id: coachId,
      rating: 5,
      comment: 'Excelente coach, me ayudó muchísimo con mis objetivos.',
      tags: ['professional', 'helpful', 'knowledgeable'],
      is_public: true,
      is_verified: true,
      created_at: new Date('2024-09-18T10:00:00'),
      updated_at: new Date('2024-09-18T10:00:00'),
    }
  ];
  
  return createMockApiResponse(mockReviews.filter(r => r.coach_id === coachId));
}

export async function createReview(data: ReviewCreateForm & { session_id: string; coach_id: string }): Promise<Review> {
  await new Promise(resolve => setTimeout(resolve, 900));
  
  const newReview: Review = {
    id: `review-${Date.now()}`,
    session_id: data.session_id,
    client_id: CURRENT_USER_ID,
    coach_id: data.coach_id,
    rating: data.rating,
    comment: data.comment,
    tags: data.tags || [],
    is_public: data.is_public,
    is_verified: false,
    created_at: new Date(),
    updated_at: new Date(),
  };
  
  return createMockApiResponse(validateData(ReviewSchema, newReview));
}

// ============================================================================
// USERS API
// ============================================================================

export async function fetchCurrentUser(): Promise<User> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const mockUser: User = {
    id: CURRENT_USER_ID,
    email: 'maria.lopez@example.com',
    role: 'client',
    status: 'active',
    first_name: 'María',
    last_name: 'López',
    profile_image: 'https://images.unsplash.com/photo-1494790108755-2616b612b372?w=400',
    phone: '+34 612 345 678',
    timezone: 'Europe/Madrid',
    language: 'es',
    email_notifications: true,
    push_notifications: true,
    marketing_emails: false,
    created_at: new Date('2024-08-01'),
    updated_at: new Date('2024-09-20'),
    last_login: new Date('2024-09-20'),
  };
  
  return createMockApiResponse(validateData(UserSchema, mockUser));
}

export async function updateUser(id: string, data: Partial<User>): Promise<User> {
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const user = await fetchCurrentUser();
  const updatedUser = {
    ...user,
    ...data,
    updated_at: new Date(),
  };
  
  return createMockApiResponse(validateData(UserSchema, updatedUser));
}