import { Coach, Session, Review, User } from '@/schemas';
import { SessionSchema, ReviewSchema, UserSchema } from '@/schemas';
import { generateUUID } from '@/lib/validation';
import { 
  mockUsers,
  createMockApiResponse
} from '@/lib/mock-data';

// ============================================================================
// TYPES
// ============================================================================

interface ApiResponse<T> {
  data: T;
  error?: string;
  metadata?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

// ============================================================================
// UTILITIES
// ============================================================================

const CURRENT_USER_ID = 'current-user-123';

function createApiResponse<T>(data: T, metadata?: ApiResponse<T>['metadata']): T {
  // In a real app, this would return { data, metadata }
  // For simplicity, we're just returning the data
  return data;
}

// Generate date helper
function generateDate(): Date {
  return new Date();
}

interface QueryParams {
  filters?: Record<string, any>;
  search?: string;
  sortBy?: {
    field: string;
    order?: 'asc' | 'desc';
  };
  pagination?: {
    page?: number;
    limit?: number;
  };
}

export interface CoachFilters {
  category?: string;
  isActive?: boolean;
}

function applyFilters<T extends Record<string, any>>(
  items: T[], 
  filters: Record<string, any>
): T[] {
  return items.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === undefined || value === null || value === '') return true;
      
      const itemValue = item[key];
      
      // Array contains filter
      if (Array.isArray(itemValue)) {
        return itemValue.includes(value);
      }
      
      // String contains filter (case insensitive)
      if (typeof itemValue === 'string' && typeof value === 'string') {
        return itemValue.toLowerCase().includes(value.toLowerCase());
      }
      
      // Exact match for other types
      return itemValue === value;
    });
  });
}

function applyPagination<T>(
  items: T[], 
  page: number = 1, 
  limit: number = 10
): { data: T[]; metadata: ApiResponse<T[]>['metadata'] } {
  const offset = (page - 1) * limit;
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const paginatedItems = items.slice(offset, offset + limit);
  
  return {
    data: paginatedItems,
    metadata: {
      page,
      limit,
      total,
      totalPages
    }
  };
}

// ============================================================================
// COACHES API
// ============================================================================

// Mock coaches data
const mockCoaches: Coach[] = [
  {
    id: generateUUID(),
    name: 'Ana García',
    handle: '@ana_coach',
    role: 'Coach',
    avatar: '/src/assets/coach-ana.jpg',
    bio: 'Coach profesional especializada en liderazgo y desarrollo de carrera',
    headline: 'Coach de Liderazgo y Carrera Profesional',
    category: 'Carrera Profesional',
    rating: 4.9,
    reviewsCount: 127,
    showUpRate: 0.98,
    priceHintS1: 'Desde 65€/sesión',
    badges: ['Top Coach', 'Verificado'],
    specialties: ['Liderazgo', 'Desarrollo profesional', 'Transición de carrera'],
    languages: ['Español', 'Inglés'],
    location: 'Madrid, España',
    faq: [
      {
        question: '¿Cómo es tu metodología de coaching?',
        answer: 'Utilizo un enfoque integral que combina técnicas de coaching ontológico con herramientas de desarrollo profesional.'
      }
    ],
    reviews: [
      {
        text: 'Ana me ayudó a conseguir el ascenso que tanto deseaba. Excelente profesional.',
        author: 'María L.'
      }
    ]
  }
];

export async function fetchCoaches(filters?: CoachFilters): Promise<Coach[]> {
  await new Promise(resolve => setTimeout(resolve, 800));
  return createApiResponse(mockCoaches);
}

export async function fetchCoach(id: string): Promise<Coach> {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const coach = mockCoaches.find(c => c.id === id);
  if (!coach) {
    throw new Error(`Coach with id ${id} not found`);
  }
  
  return createApiResponse(coach);
}

// ============================================================================
// SESSIONS API
// ============================================================================

// Mock sessions data  
const mockSessions: Session[] = [];

export async function fetchSessions(userId: string, role: 'client' | 'coach' = 'client'): Promise<Session[]> {
  await new Promise(resolve => setTimeout(resolve, 600));
  return createApiResponse(mockSessions);
}

export async function fetchSession(id: string): Promise<Session> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const session = mockSessions.find(s => s.id === id);
  if (!session) {
    throw new Error(`Session with id ${id} not found`);
  }
  
  return createApiResponse(session);
}

export async function createSession(data: Omit<Session, 'id' | 'created_at' | 'updated_at'>): Promise<Session> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newSession: Session = {
    ...data,
    id: generateUUID(),
    created_at: generateDate(),
    updated_at: generateDate(),
  };
  
  mockSessions.push(newSession);
  
  return createApiResponse(newSession);
}

export async function updateSession(id: string, data: Partial<Session>): Promise<Session> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const sessionIndex = mockSessions.findIndex(s => s.id === id);
  if (sessionIndex === -1) {
    throw new Error(`Session with id ${id} not found`);
  }
  
  const updatedSession = {
    ...mockSessions[sessionIndex],
    ...data,
    updated_at: generateDate(),
  };
  
  mockSessions[sessionIndex] = updatedSession;
  
  return createApiResponse(updatedSession);
}

export async function cancelSession(id: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const sessionIndex = mockSessions.findIndex(s => s.id === id);
  if (sessionIndex === -1) {
    throw new Error(`Session with id ${id} not found`);
  }
  
  mockSessions[sessionIndex] = {
    ...mockSessions[sessionIndex],
    status: 'cancelled',
    updated_at: generateDate(),
  };
}

// ============================================================================
// REVIEWS API
// ============================================================================

// Mock reviews data
const mockReviews: Review[] = [];

export async function fetchReviews(filters?: Record<string, any>): Promise<Review[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return createApiResponse(mockReviews);
}

export async function createReview(data: Omit<Review, 'id' | 'created_at' | 'updated_at'>): Promise<Review> {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newReview: Review = {
    ...data,
    id: generateUUID(),
    is_verified: false,
    created_at: generateDate(),
    updated_at: generateDate(),
  };
  
  mockReviews.push(newReview);
  
  return createApiResponse(newReview);
}

// ============================================================================
// USERS API
// ============================================================================

export async function fetchCurrentUser(): Promise<User> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const mockUser: User = {
    id: CURRENT_USER_ID,
    user_id: CURRENT_USER_ID,
    display_name: 'María López',
    role: 'client',
    status: 'active',
    timezone: 'Europe/Madrid',
    language: 'es',
    email_notifications: true,
    push_notifications: true,
    marketing_emails: false,
    created_at: '2024-08-01T00:00:00Z',
    updated_at: '2024-09-20T00:00:00Z',
  };
  
  return createApiResponse(mockUser);
}

export async function updateUser(id: string, data: Partial<User>): Promise<User> {
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const user = await fetchCurrentUser();
  const updatedUser = {
    ...user,
    ...data,
    updated_at: new Date().toISOString(),
  };
  
  return createApiResponse(updatedUser);
}