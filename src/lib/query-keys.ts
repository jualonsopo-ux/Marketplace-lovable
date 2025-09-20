/**
 * TanStack Query Keys Factory
 * Provides type-safe query keys for consistent cache management
 */

interface CoachFilters {
  category?: string;
  minRating?: number;
  maxPrice?: number;
  languages?: string[];
  specializations?: string[];
  isActive?: boolean;
  verificationStatus?: string;
}

export const queryKeys = {
  // Users
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters?: Record<string, any>) => [...queryKeys.users.lists(), { filters }] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },

  // Coaches
  coaches: {
    all: ['coaches'] as const,
    lists: () => [...queryKeys.coaches.all, 'list'] as const,
    list: (filters?: CoachFilters) => [...queryKeys.coaches.lists(), { filters }] as const,
    details: () => [...queryKeys.coaches.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.coaches.details(), id] as const,
    availability: (coachId: string) => [...queryKeys.coaches.detail(coachId), 'availability'] as const,
  },

  // Sessions
  sessions: {
    all: ['sessions'] as const,
    lists: () => [...queryKeys.sessions.all, 'list'] as const,
    list: (userId: string, role: 'client' | 'coach') => [...queryKeys.sessions.lists(), { userId, role }] as const,
    details: () => [...queryKeys.sessions.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.sessions.details(), id] as const,
    upcoming: (userId: string) => [...queryKeys.sessions.all, 'upcoming', userId] as const,
    history: (userId: string) => [...queryKeys.sessions.all, 'history', userId] as const,
  },

  // Reviews
  reviews: {
    all: ['reviews'] as const,
    lists: () => [...queryKeys.reviews.all, 'list'] as const,
    list: (coachId: string) => [...queryKeys.reviews.lists(), { coachId }] as const,
    detail: (id: string) => [...queryKeys.reviews.all, 'detail', id] as const,
  },

  // Categories
  categories: {
    all: ['categories'] as const,
    lists: () => [...queryKeys.categories.all, 'list'] as const,
    active: () => [...queryKeys.categories.lists(), 'active'] as const,
  },

  // Notifications
  notifications: {
    all: ['notifications'] as const,
    lists: () => [...queryKeys.notifications.all, 'list'] as const,
    list: (userId: string) => [...queryKeys.notifications.lists(), { userId }] as const,
    unread: (userId: string) => [...queryKeys.notifications.all, 'unread', userId] as const,
  },

  // Payments
  payments: {
    all: ['payments'] as const,
    lists: () => [...queryKeys.payments.all, 'list'] as const,
    list: (userId: string) => [...queryKeys.payments.lists(), { userId }] as const,
    detail: (id: string) => [...queryKeys.payments.all, 'detail', id] as const,
  },
} as const;