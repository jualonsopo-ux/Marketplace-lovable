import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { queryKeys } from '@/lib/query-keys';
import * as api from '@/lib/api';
import type { CoachFilters } from '@/lib/api';
import type { CoachProfile } from '@/schemas';

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
    select: (data) => data.filter(coach => coach.is_featured).slice(0, 6),
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
// MUTATION HOOKS
// ============================================================================

export function useCreateCoachProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.createCoachProfile,
    onSuccess: (newCoach) => {
      // Invalidate coaches list to include the new coach
      queryClient.invalidateQueries({ queryKey: queryKeys.coaches.all });
      
      // Add the new coach to the cache
      queryClient.setQueryData(queryKeys.coaches.detail(newCoach.id), newCoach);
      
      toast({
        title: "Perfil creado",
        description: "Tu perfil de coach ha sido creado exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error creating coach profile:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el perfil. Inténtalo de nuevo.",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateCoachProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CoachProfile> }) => 
      api.updateCoachProfile(id, data),
    onSuccess: (updatedCoach) => {
      // Update the specific coach in cache
      queryClient.setQueryData(queryKeys.coaches.detail(updatedCoach.id), updatedCoach);
      
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.coaches.lists() });
      
      toast({
        title: "Perfil actualizado",
        description: "Los cambios han sido guardados correctamente.",
      });
    },
    onError: (error) => {
      console.error('Error updating coach profile:', error);
      toast({
        title: "Error",
        description: "No se pudieron guardar los cambios. Inténtalo de nuevo.",
        variant: "destructive",
      });
    },
  });
}

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
        coach.user.first_name.toLowerCase().includes(searchTerm) ||
        coach.user.last_name.toLowerCase().includes(searchTerm) ||
        coach.title.toLowerCase().includes(searchTerm) ||
        coach.bio.toLowerCase().includes(searchTerm) ||
        coach.specializations.some(spec => 
          spec.toLowerCase().includes(searchTerm)
        )
      );
    },
    enabled: query.length >= 2, // Only search with 2+ characters
    staleTime: 30 * 1000, // 30 seconds for search results
  });
}

// ============================================================================
// OPTIMISTIC UPDATES & CACHE UTILITIES
// ============================================================================

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
    totalSessions: coach?.total_sessions || 0,
    averageRating: coach?.average_rating || 0,
    totalReviews: coach?.total_reviews || 0,
    responseTime: coach?.response_time_hours || 24,
    showUpRate: 0.95, // Mock data - would come from sessions
    isVerified: coach?.verification_status === 'verified',
    isFeatured: coach?.is_featured || false,
  };
}