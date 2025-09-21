-- Fix security issues with proper approach

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

-- Drop existing admin policies that might cause recursion
DROP POLICY IF EXISTS "Admin users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin users can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin can view all coach profiles" ON public.coach_profiles;
DROP POLICY IF EXISTS "Admin can manage all coach profiles" ON public.coach_profiles;

-- Create proper admin policies using the security definer function
CREATE POLICY "Admin users can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admin users can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (
  auth.uid() = user_id OR 
  public.get_current_user_role() = 'admin'
);

CREATE POLICY "Admin can view all coach profiles" 
ON public.coach_profiles 
FOR SELECT 
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admin can manage all coach profiles" 
ON public.coach_profiles 
FOR ALL 
USING (public.get_current_user_role() = 'admin');

-- Create platform stats view (no RLS policies needed on views)
CREATE OR REPLACE VIEW public.platform_stats AS
SELECT 
  (SELECT COUNT(*) FROM public.profiles) AS total_users,
  (SELECT COUNT(*) FROM public.profiles WHERE role = 'coach') AS total_coaches,
  (SELECT COUNT(*) FROM public.profiles WHERE role = 'client') AS total_clients,
  (SELECT COUNT(*) FROM public.coach_profiles WHERE is_active = true) AS active_coaches,
  (SELECT COUNT(*) FROM public.sessions) AS total_sessions,
  (SELECT COUNT(*) FROM public.sessions WHERE status = 'completed') AS completed_sessions,
  (SELECT COALESCE(SUM(price_eur), 0) FROM public.sessions WHERE status = 'completed') AS total_revenue;

-- Grant select on platform_stats to authenticated users
GRANT SELECT ON public.platform_stats TO authenticated;

-- Update other admin policies for sessions and reviews
CREATE POLICY "Admin can view all sessions" 
ON public.sessions 
FOR SELECT 
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admin can view all reviews" 
ON public.reviews 
FOR SELECT 
USING (public.get_current_user_role() = 'admin');

-- Fix activity logs access
CREATE POLICY "Admin can view activity logs" 
ON public.activity_logs 
FOR SELECT 
USING (public.get_current_user_role() = 'admin');

-- Grant necessary permissions
GRANT SELECT ON public.activity_logs TO authenticated;