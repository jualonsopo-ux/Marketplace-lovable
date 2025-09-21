import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { queryKeys } from '@/lib/query-keys';
import * as api from '@/lib/api';
import type { ReviewCreateForm, Review } from '@/schemas';

// ============================================================================
// QUERY HOOKS
// ============================================================================

export function useReviews(coachId: string) {
  return useQuery({
    queryKey: queryKeys.reviews.list(coachId),
    queryFn: () => api.fetchReviews({ coach_id: coachId }),
    enabled: !!coachId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useReviewStats(coachId: string) {
  const { data: reviews = [] } = useReviews(coachId);
  
  const stats = {
    total: reviews.length,
    averageRating: reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0,
    ratingDistribution: {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length,
    },
    commonTags: getCommonTags(reviews),
    publicReviews: reviews.filter(r => r.is_public),
    verifiedReviews: reviews.filter(r => r.is_verified),
  };
  
  return stats;
}

// Helper function to calculate common tags
function getCommonTags(reviews: Review[]) {
  const tagCounts: Record<string, number> = {};
  
  reviews.forEach(review => {
    review.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  
  return Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([tag, count]) => ({ tag, count }));
}

// ============================================================================
// MUTATION HOOKS
// ============================================================================

export function useCreateReview() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (reviewData: ReviewCreateForm & { session_id: string; coach_id: string }) => 
      api.createReview({
        ...reviewData,
        session_id: reviewData.session_id,
        coach_id: reviewData.coach_id,
        client_id: 'current-user-123', // This would come from auth context in real app
        is_verified: false,
      }),
    onSuccess: (newReview) => {
      // Update reviews list for the coach
      const reviewsKey = queryKeys.reviews.list(newReview.coach_id);
      queryClient.setQueryData(reviewsKey, (old: Review[] = []) => {
        return [newReview, ...old];
      });
      
      // Invalidate coach data to update rating
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.coaches.detail(newReview.coach_id) 
      });
      
      toast({
        title: "Reseña enviada",
        description: "Tu reseña ha sido publicada. Gracias por tu feedback.",
      });
    },
    onError: (error) => {
      console.error('Error creating review:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar la reseña. Inténtalo de nuevo.",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Review> }) => {
      // Mock update function - would be real API call
      return new Promise<Review>(resolve => {
        setTimeout(() => {
          resolve({ ...data, id, updated_at: new Date() } as Review);
        }, 500);
      });
    },
    onSuccess: (updatedReview) => {
      // Update the review in the list
      const reviewsKey = queryKeys.reviews.list(updatedReview.coach_id);
      queryClient.setQueryData(reviewsKey, (old: Review[] = []) => {
        return old.map(review => 
          review.id === updatedReview.id ? updatedReview : review
        );
      });
      
      toast({
        title: "Reseña actualizada",
        description: "Los cambios han sido guardados.",
      });
    },
    onError: (error) => {
      console.error('Error updating review:', error);
      toast({
        title: "Error",
        description: "No se pudieron guardar los cambios.",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (reviewId: string) => {
      // Mock delete function - would be real API call
      return new Promise<void>(resolve => {
        setTimeout(resolve, 500);
      });
    },
    onSuccess: (_, reviewId) => {
      // Remove review from all relevant caches
      queryClient.setQueriesData(
        { queryKey: queryKeys.reviews.all },
        (old: Review[] | undefined) => {
          return old?.filter(review => review.id !== reviewId) || [];
        }
      );
      
      toast({
        title: "Reseña eliminada",
        description: "La reseña ha sido eliminada correctamente.",
      });
    },
    onError: (error) => {
      console.error('Error deleting review:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la reseña.",
        variant: "destructive",
      });
    },
  });
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

export function useCanReview(sessionId: string, userId: string) {
  // Check if user can leave a review for this session
  return useQuery({
    queryKey: ['can-review', sessionId, userId],
    queryFn: async () => {
      // Mock logic - would check if session is completed and no review exists
      await new Promise(resolve => setTimeout(resolve, 200));
      return {
        canReview: true,
        reason: null as string | null,
      };
    },
    enabled: !!sessionId && !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useReviewReminder(sessionId: string) {
  // Check if user should be reminded to leave a review
  return useQuery({
    queryKey: ['review-reminder', sessionId],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
      return {
        shouldRemind: false,
        daysAfterSession: 0,
      };
    },
    enabled: !!sessionId,
    staleTime: 10 * 60 * 1000,
  });
}

// ============================================================================
// PREFETCH UTILITIES
// ============================================================================

export function usePrefetchReviews() {
  const queryClient = useQueryClient();
  
  return (coachId: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.reviews.list(coachId),
      queryFn: () => api.fetchReviews({ coach_id: coachId }),
      staleTime: 5 * 60 * 1000,
    });
  };
}