-- Final setup - only create what's missing

-- Ensure we have the security definer function
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT 
LANGUAGE SQL 
SECURITY DEFINER 
STABLE 
SET search_path = public
AS $$
  SELECT role::text FROM public.profiles WHERE user_id = auth.uid();
$$;

-- Create platform stats view if it doesn't exist
CREATE OR REPLACE VIEW public.platform_stats AS
SELECT 
  (SELECT COUNT(*) FROM public.profiles) AS total_users,
  (SELECT COUNT(*) FROM public.profiles WHERE role = 'coach') AS total_coaches,
  (SELECT COUNT(*) FROM public.profiles WHERE role = 'client') AS total_clients,
  (SELECT COUNT(*) FROM public.coach_profiles WHERE is_active = true) AS active_coaches,
  (SELECT COUNT(*) FROM public.sessions) AS total_sessions,
  (SELECT COUNT(*) FROM public.sessions WHERE status = 'completed') AS completed_sessions,
  (SELECT COALESCE(SUM(price_eur), 0) FROM public.sessions WHERE status = 'completed') AS total_revenue;

-- Function to create an admin user for testing
CREATE OR REPLACE FUNCTION public.create_admin_user(user_email TEXT)
RETURNS VOID 
LANGUAGE SQL 
SECURITY DEFINER 
SET search_path = public
AS $$
  INSERT INTO public.profiles (user_id, display_name, role)
  SELECT id, user_email, 'admin'::user_role_enum
  FROM auth.users 
  WHERE email = user_email
  ON CONFLICT (user_id) DO UPDATE SET role = 'admin'::user_role_enum;
$$;

-- Grant necessary permissions
GRANT SELECT ON public.platform_stats TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;