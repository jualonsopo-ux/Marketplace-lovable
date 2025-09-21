import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface CoachAnalyticsData {
  totalRevenue: number;
  completedSessions: number;
  totalSessions: number;
  completionRate: number;
  averageRating: number;
  sessions: Array<{
    id: number;
    starts_at: string;
    ends_at: string;
    price_eur: number;
    status: string;
  }>;
}

async function fetchCoachAnalytics(
  coachId: string, 
  period: 'week' | 'month' | 'year' = 'month'
): Promise<CoachAnalyticsData> {
  // Calculate date range based on period
  const now = new Date();
  const startDate = new Date();
  
  switch (period) {
    case 'week':
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(now.getMonth() - 1);
      break;
    case 'year':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
  }

  // Fetch sessions data
  const { data: sessions, error } = await supabase
    .from('sessions')
    .select('id, starts_at, ends_at, price_eur, status')
    .eq('created_by', coachId)
    .gte('starts_at', startDate.toISOString())
    .lte('starts_at', now.toISOString())
    .order('starts_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch analytics: ${error.message}`);
  }

  const sessionsData = sessions || [];
  
  // Calculate metrics
  const completedSessions = sessionsData.filter(s => s.status === 'completed');
  const totalRevenue = completedSessions.reduce((sum, session) => sum + Number(session.price_eur || 0), 0);
  const totalSessions = sessionsData.length;
  const completionRate = totalSessions > 0 ? (completedSessions.length / totalSessions) * 100 : 0;
  
  // Calculate average rating (placeholder - will be implemented when reviews are available)
  const averageRating = 0;

  // Transform sessions data
  const transformedSessions = sessionsData.map(session => ({
    id: session.id,
    starts_at: session.starts_at,
    ends_at: session.ends_at,
    price_eur: Number(session.price_eur || 0),
    status: session.status
  }));

  return {
    totalRevenue,
    completedSessions: completedSessions.length,
    totalSessions,
    completionRate,
    averageRating,
    sessions: transformedSessions
  };
}

export function useCoachAnalytics(period: 'week' | 'month' | 'year' = 'month') {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['coach-analytics', user?.id, period],
    queryFn: () => {
      if (!user?.id) throw new Error('User not authenticated');
      return fetchCoachAnalytics(user.id, period);
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}