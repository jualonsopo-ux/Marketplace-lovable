import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface CoachAnalyticsData {
  totalRevenue: number;
  completedBookings: number;
  totalBookings: number;
  completionRate: number;
  averageRating: number;
  bookings: Array<{
    id: string;
    scheduled_at: string;
    status: string;
    name: string;
    email: string;
  }>;
}

async function fetchCoachAnalytics(
  userId: string, 
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

  // First get the coach for this user
  const { data: coach, error: coachError } = await supabase
    .from('coaches')
    .select('id')
    .eq('profile_id', userId)
    .single();

  if (coachError || !coach) {
    throw new Error(`Failed to find coach: ${coachError?.message || 'No coach found'}`);
  }

  // Fetch bookings data using coach_id
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('id, scheduled_at, status, name, email')
    .eq('coach_id', coach.id)
    .gte('scheduled_at', startDate.toISOString())
    .lte('scheduled_at', now.toISOString())
    .order('scheduled_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch bookings: ${error.message}`);
  }

  const bookingsData = bookings || [];
  
  // Calculate metrics
  const completedBookings = bookingsData.filter(b => b.status === 'completed');
  const totalRevenue = 0; // Revenue calculation would need pricing data from offerings
  const totalBookings = bookingsData.length;
  const completionRate = totalBookings > 0 ? (completedBookings.length / totalBookings) * 100 : 0;
  
  // Calculate average rating (placeholder - will be implemented when reviews are available)
  const averageRating = 0;

  // Transform bookings data
  const transformedBookings = bookingsData.map(booking => ({
    id: booking.id,
    scheduled_at: booking.scheduled_at,
    status: booking.status,
    name: booking.name,
    email: booking.email
  }));

  return {
    totalRevenue,
    completedBookings: completedBookings.length,
    totalBookings,
    completionRate,
    averageRating,
    bookings: transformedBookings
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