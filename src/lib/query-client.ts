import { QueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

/**
 * TanStack Query Client Configuration
 * Optimized for CoachWave platform with proper error handling and caching
 */

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Default stale time: 2 minutes
      staleTime: 2 * 60 * 1000,
      // Default garbage collection time: 5 minutes  
      gcTime: 5 * 60 * 1000,
      // Retry configuration
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (client errors)
        if (error instanceof Error) {
          const message = error.message.toLowerCase();
          if (message.includes('unauthorized') || 
              message.includes('forbidden') || 
              message.includes('not found')) {
            return false;
          }
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      // Retry delay with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus for important data
      refetchOnWindowFocus: (query) => {
        // Only refetch certain queries on window focus
        const importantKeys = ['users', 'sessions'];
        return importantKeys.some(key => 
          query.queryKey.some(k => typeof k === 'string' && k.includes(key))
        );
      },
      // Don't refetch on reconnect by default
      refetchOnReconnect: false,
    },
    mutations: {
      // Global error handler for mutations
      onError: (error, variables, context) => {
        console.error('Mutation error:', error);
        
        // Don't show toast for specific errors that are handled by individual mutations
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        if (!errorMessage.includes('handled')) {
          toast({
            title: "Error inesperado",
            description: "Algo salió mal. Por favor, inténtalo de nuevo.",
            variant: "destructive",
          });
        }
      },
      // Default retry for mutations
      retry: (failureCount, error) => {
        // Don't retry mutations by default - they usually should be user-initiated
        return false;
      },
    },
  },
});

// Global error boundary handler
export function handleQueryError(error: Error, errorInfo?: any) {
  console.error('React Query Error:', error, errorInfo);
  
  // Log to external service in production
  if (process.env.NODE_ENV === 'production') {
    // Would integrate with error reporting service like Sentry
    // Sentry.captureException(error, { extra: errorInfo });
  }
}

// Cache utilities
export const cacheUtils = {
  // Clear all data (useful for logout)
  clearAll: () => {
    queryClient.clear();
  },
  
  // Clear user-specific data
  clearUserData: (userId: string) => {
    queryClient.removeQueries({ 
      predicate: (query) => {
        return query.queryKey.some(key => 
          typeof key === 'string' && key.includes(userId)
        );
      }
    });
  },
  
  // Prefetch critical data
  prefetchCriticalData: async (userId: string) => {
    const promises = [
      // Prefetch user profile
      queryClient.prefetchQuery({
        queryKey: ['users', 'detail', userId],
        staleTime: 5 * 60 * 1000,
      }),
      // Prefetch upcoming sessions
      queryClient.prefetchQuery({
        queryKey: ['sessions', 'upcoming', userId],
        staleTime: 1 * 60 * 1000,
      }),
    ];
    
    await Promise.allSettled(promises);
  },
  
  // Invalidate stale data
  invalidateStaleData: () => {
    queryClient.invalidateQueries({ 
      predicate: (query) => {
        const now = Date.now();
        return query.isStale();
      }
    });
  },
  
  // Get cache statistics
  getCacheStats: () => {
    const queries = queryClient.getQueryCache().getAll();
    
    return {
      totalQueries: queries.length,
      freshQueries: queries.filter(q => q.state.status === 'success' && !q.isStale()).length,
      staleQueries: queries.filter(q => q.isStale()).length,
      errorQueries: queries.filter(q => q.state.status === 'error').length,
      loadingQueries: queries.filter(q => q.state.status === 'pending').length,
      cacheSize: JSON.stringify(queryClient.getQueryCache()).length,
    };
  },
};

// Development tools
if (process.env.NODE_ENV === 'development') {
  // Log cache stats periodically in development
  setInterval(() => {
    const stats = cacheUtils.getCacheStats();
    console.log('React Query Cache Stats:', stats);
  }, 30000); // Every 30 seconds
  
  // Expose utilities globally for debugging
  (window as any).queryClient = queryClient;
  (window as any).cacheUtils = cacheUtils;
}