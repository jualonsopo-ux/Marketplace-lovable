-- Clean up and fix policy conflicts

-- Drop all existing admin-related policies first
DROP POLICY IF EXISTS "Admin can view activity logs" ON public.activity_logs;
DROP POLICY IF EXISTS "Admin can view all sessions" ON public.sessions;
DROP POLICY IF EXISTS "Admin can view all reviews" ON public.reviews;

-- Create security definer function to get user role (prevents infinite recursion)
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT 
LANGUAGE SQL 
SECURITY DEFINER 
STABLE 
SET search_path = public
AS $$
  SELECT role::text FROM public.profiles WHERE user_id = auth.uid();
$$;

-- Create proper admin policies for sessions
CREATE POLICY "Admin can manage all sessions" 
ON public.sessions 
FOR ALL
USING (public.get_current_user_role() = 'admin');

-- Create proper admin policies for reviews
CREATE POLICY "Admin can manage all reviews" 
ON public.reviews 
FOR ALL
USING (public.get_current_user_role() = 'admin');

-- Create proper admin policies for activity logs
CREATE POLICY "Admin can manage activity logs" 
ON public.activity_logs 
FOR ALL
USING (public.get_current_user_role() = 'admin');

-- Create platform stats view for admin dashboard
CREATE OR REPLACE VIEW public.platform_stats AS
SELECT 
  (SELECT COUNT(*) FROM public.profiles) AS total_users,
  (SELECT COUNT(*) FROM public.profiles WHERE role = 'coach') AS total_coaches,
  (SELECT COUNT(*) FROM public.profiles WHERE role = 'client') AS total_clients,
  (SELECT COUNT(*) FROM public.coach_profiles WHERE is_active = true) AS active_coaches,
  (SELECT COUNT(*) FROM public.sessions) AS total_sessions,
  (SELECT COUNT(*) FROM public.sessions WHERE status = 'completed') AS completed_sessions,
  (SELECT COALESCE(SUM(price_eur), 0) FROM public.sessions WHERE status = 'completed') AS total_revenue;

-- Grant permissions
GRANT SELECT ON public.platform_stats TO authenticated;
GRANT ALL ON public.activity_logs TO authenticated;