import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { queryKeys } from '@/lib/query-keys';
import * as api from '@/lib/api';
import type { User } from '@/schemas';

// ============================================================================
// QUERY HOOKS
// ============================================================================

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.users.detail('current'),
    queryFn: api.fetchCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error instanceof Error && error.message.includes('unauthorized')) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => {
      // For now, only support current user
      if (id === 'current') {
        return api.fetchCurrentUser();
      }
      throw new Error('User lookup not implemented yet');
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// ============================================================================
// MUTATION HOOKS
// ============================================================================

export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) => 
      api.updateUser(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.users.detail(id) });
      
      // Snapshot previous value
      const previousUser = queryClient.getQueryData(queryKeys.users.detail(id));
      
      // Optimistically update to new value
      queryClient.setQueryData(queryKeys.users.detail(id), (old: User | undefined) => {
        if (!old) return old;
        return { ...old, ...data, updated_at: new Date() };
      });
      
      return { previousUser };
    },
    onError: (error, { id }, context) => {
      // Rollback on error
      if (context?.previousUser) {
        queryClient.setQueryData(queryKeys.users.detail(id), context.previousUser);
      }
      
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "No se pudieron guardar los cambios. Inténtalo de nuevo.",
        variant: "destructive",
      });
    },
    onSuccess: (updatedUser) => {
      // Update cache with server response
      queryClient.setQueryData(queryKeys.users.detail(updatedUser.id), updatedUser);
      
      // If this is the current user, also update the 'current' key
      const currentUserData = queryClient.getQueryData(queryKeys.users.detail('current'));
      if (currentUserData && (currentUserData as User).id === updatedUser.id) {
        queryClient.setQueryData(queryKeys.users.detail('current'), updatedUser);
      }
      
      toast({
        title: "Perfil actualizado",
        description: "Tus cambios han sido guardados correctamente.",
      });
    },
  });
}

export function useUpdateUserPreferences() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (preferences: Partial<Pick<User, 'email_notifications' | 'push_notifications' | 'marketing_emails' | 'language' | 'timezone'>>) => {
      // Get current user first
      const currentUser = queryClient.getQueryData(queryKeys.users.detail('current')) as User;
      if (!currentUser) {
        throw new Error('User not found');
      }
      
      return api.updateUser(currentUser.id, preferences);
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(queryKeys.users.detail('current'), updatedUser);
      queryClient.setQueryData(queryKeys.users.detail(updatedUser.id), updatedUser);
      
      toast({
        title: "Preferencias actualizadas",
        description: "Tus preferencias han sido guardadas.",
      });
    },
    onError: (error) => {
      console.error('Error updating preferences:', error);
      toast({
        title: "Error",
        description: "No se pudieron actualizar las preferencias.",
        variant: "destructive",
      });
    },
  });
}

// ============================================================================
// AUTHENTICATION UTILITIES
// ============================================================================

export function useLogout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      // Mock logout - would call real auth service
      await new Promise(resolve => setTimeout(resolve, 500));
    },
    onSuccess: () => {
      // Clear all queries
      queryClient.clear();
      
      // Redirect to login
      window.location.href = '/login';
      
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente.",
      });
    },
    onError: (error) => {
      console.error('Error during logout:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al cerrar sesión.",
        variant: "destructive",
      });
    },
  });
}

// ============================================================================
// PROFILE UTILITIES
// ============================================================================

export function useUserProfile() {
  const { data: user, ...rest } = useCurrentUser();
  
  return {
    ...rest,
    data: user,
    displayName: user ? `${user.first_name} ${user.last_name}` : '',
    initials: user ? `${user.first_name[0]}${user.last_name[0]}` : '',
    isCoach: user?.role === 'coach',
    isClient: user?.role === 'client',
    isActive: user?.status === 'active',
  };
}

export function useUserStats() {
  const { data: user } = useCurrentUser();
  
  // Mock stats - would come from real analytics
  return useQuery({
    queryKey: ['user-stats', user?.id],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        totalSessions: 12,
        completedSessions: 10,
        upcomingSessions: 2,
        totalSpent: 450,
        averageRating: 4.8,
        favoriteCoaches: 3,
        memberSince: user?.created_at || new Date(),
      };
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });
}

// ============================================================================
// PREFETCH UTILITIES
// ============================================================================

export function useInvalidateUser() {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
  };
}