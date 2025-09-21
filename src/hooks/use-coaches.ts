import { useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import * as api from '@/lib/api';
import type { CoachFilters } from '@/lib/api';

// ============================================================================
// QUERY HOOKS
// ============================================================================

export function useCoaches(filters?: CoachFilters) {
  return useQuery({
    queryKey: queryKeys.coaches.list(filters),
    queryFn: () => api.fetchCoaches(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: (failureCount, error) => {
      // Don't retry on 404s
      if (error instanceof Error && error.message.includes('not found')) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

export function useCoach(id: string) {
  return useQuery({
    queryKey: queryKeys.coaches.detail(id),
    queryFn: () => api.fetchCoach(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useFeaturedCoaches() {
  return useQuery({
    queryKey: queryKeys.coaches.list({ isActive: true }),
    queryFn: () => api.fetchCoaches({ isActive: true }),
    select: (data) => data.slice(0, 6),
    staleTime: 10 * 60 * 1000, // 10 minutes for featured content
  });
}

export function useCoachesByCategory(category: string) {
  return useQuery({
    queryKey: queryKeys.coaches.list({ category }),
    queryFn: () => api.fetchCoaches({ category }),
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
  });
}

// ============================================================================
// CACHE UTILITIES
// ============================================================================

// ============================================================================
// SEARCH & FILTERING HOOKS
// ============================================================================

export function useCoachSearch(query: string, filters?: CoachFilters) {
  return useQuery({
    queryKey: queryKeys.coaches.list({ ...filters, category: filters?.category }),
    queryFn: () => api.fetchCoaches({ ...filters }),
    select: (coaches) => {
      if (!query.trim()) return coaches;
      
      const searchTerm = query.toLowerCase();
      return coaches.filter(coach => 
        coach.name.toLowerCase().includes(searchTerm) ||
        coach.bio.toLowerCase().includes(searchTerm) ||
        coach.specialties.some(spec => 
          spec.toLowerCase().includes(searchTerm)
        )
      );
    },
    enabled: query.length >= 2, // Only search with 2+ characters
    staleTime: 30 * 1000, // 30 seconds for search results
  });
}


export function useInvalidateCoaches() {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.coaches.all });
  };
}

export function usePrefetchCoach() {
  const queryClient = useQueryClient();
  
  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.coaches.detail(id),
      queryFn: () => api.fetchCoach(id),
      staleTime: 2 * 60 * 1000,
    });
  };
}

// ============================================================================
// DERIVED DATA HOOKS
// ============================================================================

export function useCoachStats(coachId: string) {
  const { data: coach } = useCoach(coachId);
  
  return {
    totalSessions: 0,
    averageRating: coach?.rating || 0,
    totalReviews: coach?.reviewsCount || 0,
    responseTime: 24,
    showUpRate: coach?.showUpRate || 0.95,
    isVerified: true,
    isFeatured: false,
  };
}