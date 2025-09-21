/**
 * Mock data generators using the new schemas
 * These will be replaced with real API calls when Supabase is connected
 */

import { generateUUID } from './validation';
import type { User, CoachProfile, Session, Review, Category, Notification } from '@/schemas';

// Mock users
export const mockUsers: User[] = [
  {
    id: generateUUID(),
    user_id: generateUUID(),
    display_name: 'Ana García',
    avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b372?w=400',
    phone: '+34 612 345 678',
    role: 'coach',
    status: 'active',
    timezone: 'Europe/Madrid',
    language: 'es',
    email_notifications: true,
    push_notifications: true,
    marketing_emails: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-09-20T00:00:00Z',
  },
  {
    id: generateUUID(),
    user_id: generateUUID(),
    display_name: 'María López',
    role: 'client',
    status: 'active',
    timezone: 'Europe/Madrid',
    language: 'es',
    email_notifications: true,
    push_notifications: true,
    marketing_emails: true,
    created_at: '2024-08-01T00:00:00Z',
    updated_at: '2024-09-19T00:00:00Z',
  },
];

// Mock categories
export const mockCategories: Category[] = [
  {
    id: generateUUID(),
    name: 'Carrera Profesional',
    slug: 'carrera-profesional',
    description: 'Coaching para desarrollo profesional y liderazgo',
    icon: 'Briefcase',
    color: '#3B82F6',
    is_active: true,
    sort_order: 1,
    meta_title: 'Coaching de Carrera Profesional',
    meta_description: 'Encuentra tu coach ideal para impulsar tu carrera profesional y liderazgo',
  },
  {
    id: generateUUID(),
    name: 'Bienestar Personal',
    slug: 'bienestar-personal',
    description: 'Coaching para hábitos, mindfulness y bienestar',
    icon: 'Heart',
    color: '#10B981',
    is_active: true,
    sort_order: 2,
    meta_title: 'Coaching de Bienestar Personal',
    meta_description: 'Coaches especializados en hábitos saludables y bienestar personal',
  },
  {
    id: generateUUID(),
    name: 'Ansiedad y Estrés',
    slug: 'ansiedad-estres',
    description: 'Psicólogos especializados en ansiedad y manejo del estrés',
    icon: 'Brain',
    color: '#8B5CF6',
    is_active: true,
    sort_order: 3,
    meta_title: 'Psicólogos para Ansiedad y Estrés',
    meta_description: 'Encuentra psicólogos colegiados especializados en ansiedad y estrés',
  },
];

// Form validation helpers
export const defaultSessionForm = {
  title: '',
  description: '',
  scheduled_start: new Date(),
  scheduled_end: new Date(Date.now() + 60 * 60 * 1000), // 1 hour later
  session_type: 'video' as const,
  location: '',
};

export const defaultReviewForm = {
  rating: 5,
  comment: '',
  tags: [],
  is_public: true,
};

// Mock API response helpers
export function createMockApiResponse<T>(data: T, delay = 500) {
  return new Promise<T>((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
}

export function createMockErrorResponse(message: string, delay = 500) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), delay);
  });
}