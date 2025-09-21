import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { queryKeys } from '@/lib/query-keys';
import * as api from '@/lib/api';
import type { SessionCreateForm, Session } from '@/schemas';

// ============================================================================
// QUERY HOOKS
// ============================================================================

export function useSessions(userId: string, role: 'client' | 'coach' = 'client') {
  return useQuery({
    queryKey: queryKeys.sessions.list(userId, role),
    queryFn: () => api.fetchSessions(userId, role),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useSession(id: string) {
  return useQuery({
    queryKey: queryKeys.sessions.detail(id),
    queryFn: () => api.fetchSession(id),
    enabled: !!id,
    staleTime: 1 * 60 * 1000, // 1 minute for individual sessions
  });
}

export function useUpcomingSessions(userId: string, role: 'client' | 'coach' = 'client') {
  return useQuery({
    queryKey: queryKeys.sessions.upcoming(userId),
    queryFn: () => api.fetchSessions(userId, role),
    select: (sessions) => {
      const now = new Date();
      return sessions
        .filter(session => 
          session.status === 'scheduled' && 
          session.scheduled_start > now
        )
        .sort((a, b) => a.scheduled_start.getTime() - b.scheduled_start.getTime());
    },
    staleTime: 1 * 60 * 1000, // 1 minute for upcoming sessions
  });
}

export function useSessionHistory(userId: string, role: 'client' | 'coach' = 'client') {
  return useQuery({
    queryKey: queryKeys.sessions.history(userId),
    queryFn: () => api.fetchSessions(userId, role),
    select: (sessions) => {
      return sessions
        .filter(session => 
          session.status === 'completed' || session.status === 'cancelled'
        )
        .sort((a, b) => b.scheduled_start.getTime() - a.scheduled_start.getTime());
    },
    staleTime: 5 * 60 * 1000, // 5 minutes for history
  });
}

// ============================================================================
// MUTATION HOOKS
// ============================================================================

export function useCreateSession() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: SessionCreateForm & { coach_id: string }) => 
      api.createSession(data),
    onSuccess: (newSession) => {
      // Invalidate all session lists
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all });
      
      // Add the new session to cache
      queryClient.setQueryData(queryKeys.sessions.detail(newSession.id), newSession);
      
      // Optimistically update upcoming sessions
      const upcomingKey = queryKeys.sessions.upcoming(newSession.client_id);
      queryClient.setQueryData(upcomingKey, (old: Session[] = []) => {
        return [...old, newSession].sort((a, b) => 
          a.scheduled_start.getTime() - b.scheduled_start.getTime()
        );
      });
      
      toast({
        title: "Sesión reservada",
        description: "Tu sesión ha sido agendada exitosamente. Recibirás un email de confirmación.",
      });
    },
    onError: (error) => {
      console.error('Error creating session:', error);
      toast({
        title: "Error al reservar",
        description: "No se pudo agendar la sesión. Verifica los datos e inténtalo de nuevo.",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateSession() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Session> }) => 
      api.updateSession(id, data),
    onSuccess: (updatedSession) => {
      // Update the specific session in cache
      queryClient.setQueryData(queryKeys.sessions.detail(updatedSession.id), updatedSession);
      
      // Invalidate session lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.lists() });
      
      toast({
        title: "Sesión actualizada",
        description: "Los cambios han sido guardados correctamente.",
      });
    },
    onError: (error) => {
      console.error('Error updating session:', error);
      toast({
        title: "Error",
        description: "No se pudieron guardar los cambios. Inténtalo de nuevo.",
        variant: "destructive",
      });
    },
  });
}

export function useCancelSession() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => 
      api.cancelSession(id, reason),
    onSuccess: (cancelledSession) => {
      // Update the session in cache
      queryClient.setQueryData(queryKeys.sessions.detail(cancelledSession.id), cancelledSession);
      
      // Update lists
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.lists() });
      
      // Remove from upcoming sessions optimistically
      const upcomingKey = queryKeys.sessions.upcoming(cancelledSession.client_id);
      queryClient.setQueryData(upcomingKey, (old: Session[] = []) => {
        return old.filter(session => session.id !== cancelledSession.id);
      });
      
      toast({
        title: "Sesión cancelada",
        description: "La sesión ha sido cancelada. Se procesará el reembolso si aplica.",
      });
    },
    onError: (error) => {
      console.error('Error cancelling session:', error);
      toast({
        title: "Error",
        description: "No se pudo cancelar la sesión. Inténtalo de nuevo.",
        variant: "destructive",
      });
    },
  });
}

// ============================================================================
// REAL-TIME & BACKGROUND SYNC HOOKS
// ============================================================================

export function useSessionPolling(sessionId: string, enabled: boolean = false) {
  return useQuery({
    queryKey: queryKeys.sessions.detail(sessionId),
    queryFn: () => api.fetchSession(sessionId),
    enabled: enabled && !!sessionId,
    refetchInterval: enabled ? 30 * 1000 : false, // Poll every 30 seconds when enabled
    staleTime: 10 * 1000, // 10 seconds
  });
}

// ============================================================================
// PREFETCH & CACHE UTILITIES
// ============================================================================

export function usePrefetchSession() {
  const queryClient = useQueryClient();
  
  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.sessions.detail(id),
      queryFn: () => api.fetchSession(id),
      staleTime: 1 * 60 * 1000,
    });
  };
}

export function useInvalidateSessions() {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all });
  };
}

// ============================================================================
// DERIVED DATA HOOKS
// ============================================================================

export function useSessionStats(userId: string, role: 'client' | 'coach' = 'client') {
  const { data: sessions = [] } = useSessions(userId, role);
  
  const stats = {
    total: sessions.length,
    completed: sessions.filter(s => s.status === 'completed').length,
    upcoming: sessions.filter(s => s.status === 'scheduled' && s.scheduled_start > new Date()).length,
    cancelled: sessions.filter(s => s.status === 'cancelled').length,
    totalHours: sessions
      .filter(s => s.actual_end && s.actual_start)
      .reduce((acc, s) => {
        const duration = (s.actual_end!.getTime() - s.actual_start!.getTime()) / (1000 * 60 * 60);
        return acc + duration;
      }, 0),
    averageDuration: 0,
  };
  
  stats.averageDuration = stats.completed > 0 ? stats.totalHours / stats.completed : 0;
  
  return stats;
}

export function useNextSession(userId: string, role: 'client' | 'coach' = 'client') {
  const { data: upcomingSessions = [] } = useUpcomingSessions(userId, role);
  
  return upcomingSessions[0] || null;
}