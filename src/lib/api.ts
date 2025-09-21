import { Coach, Session, Review, User, QueryParams } from '@/schemas';
import { CoachSchema, SessionSchema, ReviewSchema, UserSchema } from '@/schemas';
import { 
  mockCoaches, 
  mockSessions, 
  mockReviews, 
  mockUsers,
  generateUUID, 
  generateDate 
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

function createMockApiResponse<T>(data: T, metadata?: ApiResponse<T>['metadata']): T {
  // In a real app, this would return { data, metadata }
  // For simplicity, we're just returning the data
  return data;
}

function validateData<T>(schema: any, data: any): T {
  try {
    return schema.parse(data);
  } catch (error) {
    console.error('Validation error:', error);
    throw new Error('Invalid data format');
  }
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

export async function fetchCoaches(params?: QueryParams): Promise<Coach[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  let filteredCoaches = [...mockCoaches];
  
  // Apply filters
  if (params?.filters) {
    filteredCoaches = applyFilters(filteredCoaches, params.filters);
  }
  
  // Apply search
  if (params?.search) {
    const searchLower = params.search.toLowerCase();
    filteredCoaches = filteredCoaches.filter(coach => 
      coach.name.toLowerCase().includes(searchLower) ||
      coach.specialties.some(s => s.toLowerCase().includes(searchLower)) ||
      coach.bio.toLowerCase().includes(searchLower)
    );
  }
  
  // Apply sorting
  if (params?.sortBy) {
    const { field, order = 'asc' } = params.sortBy;
    filteredCoaches.sort((a, b) => {
      const aValue = a[field as keyof Coach];
      const bValue = b[field as keyof Coach];
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return order === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return order === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });
  }
  
  // Apply pagination
  const result = applyPagination(
    filteredCoaches, 
    params?.pagination?.page, 
    params?.pagination?.limit
  );
  
  return createMockApiResponse(
    result.data.map(coach => validateData(CoachSchema, coach)),
    result.metadata
  );
}

export async function fetchCoach(id: string): Promise<Coach> {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const coach = mockCoaches.find(c => c.id === id);
  if (!coach) {
    throw new Error(`Coach with id ${id} not found`);
  }
  
  return createMockApiResponse(validateData(CoachSchema, coach));
}

// ============================================================================
// SESSIONS API
// ============================================================================

export async function fetchSessions(params?: QueryParams): Promise<Session[]> {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  let filteredSessions = [...mockSessions];
  
  // Apply filters
  if (params?.filters) {
    filteredSessions = applyFilters(filteredSessions, params.filters);
  }
  
  // Apply pagination
  const result = applyPagination(
    filteredSessions,
    params?.pagination?.page,
    params?.pagination?.limit
  );
  
  return createMockApiResponse(
    result.data.map(session => validateData(SessionSchema, session)),
    result.metadata
  );
}

export async function fetchSession(id: string): Promise<Session> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const session = mockSessions.find(s => s.id === id);
  if (!session) {
    throw new Error(`Session with id ${id} not found`);
  }
  
  return createMockApiResponse(validateData(SessionSchema, session));
}

export async function bookSession(data: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>): Promise<Session> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newSession: Session = {
    ...data,
    id: generateUUID(),
    createdAt: generateDate(),
    updatedAt: generateDate(),
  };
  
  // In a real app, this would persist to a database
  mockSessions.push(newSession);
  
  return createMockApiResponse(validateData(SessionSchema, newSession));
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
    updatedAt: generateDate(),
  };
  
  mockSessions[sessionIndex] = updatedSession;
  
  return createMockApiResponse(validateData(SessionSchema, updatedSession));
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
    updatedAt: generateDate(),
  };
}

// ============================================================================
// REVIEWS API
// ============================================================================

export async function fetchReviews(params?: QueryParams): Promise<Review[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filteredReviews = [...mockReviews];
  
  // Apply filters (e.g., by coach ID)
  if (params?.filters) {
    filteredReviews = applyFilters(filteredReviews, params.filters);
  }
  
  // Apply pagination
  const result = applyPagination(
    filteredReviews,
    params?.pagination?.page,
    params?.pagination?.limit
  );
  
  return createMockApiResponse(
    result.data.map(review => validateData(ReviewSchema, review)),
    result.metadata
  );
}

export async function createReview(data: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newReview: Review = {
    ...data,
    id: generateUUID(),
    createdAt: generateDate(),
  };
  
  // In a real app, this would persist to a database
  mockReviews.push(newReview);
  
  return createMockApiResponse(validateData(ReviewSchema, newReview));
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
  
  return createMockApiResponse(validateData(UserSchema, mockUser));
}

export async function updateUser(id: string, data: Partial<User>): Promise<User> {
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const user = await fetchCurrentUser();
  const updatedUser = {
    ...user,
    ...data,
    updated_at: new Date().toISOString(),
  };
  
  return createMockApiResponse(validateData(UserSchema, updatedUser));
}