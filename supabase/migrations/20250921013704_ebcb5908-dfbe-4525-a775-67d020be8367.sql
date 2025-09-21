-- Fix security issues identified by the linter

-- Drop and recreate the platform_stats view without security definer
DROP VIEW IF EXISTS public.platform_stats;

CREATE VIEW public.platform_stats AS
SELECT 
  (SELECT COUNT(*) FROM public.profiles) AS total_users,
  (SELECT COUNT(*) FROM public.profiles WHERE role = 'coach') AS total_coaches,
  (SELECT COUNT(*) FROM public.profiles WHERE role = 'client') AS total_clients,
  (SELECT COUNT(*) FROM public.coach_profiles WHERE is_active = true) AS active_coaches,
  (SELECT COUNT(*) FROM public.sessions) AS total_sessions,
  (SELECT COUNT(*) FROM public.sessions WHERE status = 'completed') AS completed_sessions,
  (SELECT COALESCE(SUM(price_eur), 0) FROM public.sessions WHERE status = 'completed') AS total_revenue;

-- Enable RLS on the view
ALTER VIEW public.platform_stats SET (security_barrier = true);

-- Create RLS policy for platform stats (admin only)
CREATE POLICY "Admin can view platform stats" 
ON public.platform_stats 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() AND p.role = 'admin'
  )
);

-- Fix function search path issues by setting search_path explicitly
CREATE OR REPLACE FUNCTION public.log_user_activity(
  action_text TEXT,
  details_json JSONB DEFAULT NULL
) RETURNS VOID 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.activity_logs (user_id, action, details)
  VALUES (auth.uid(), action_text, details_json);
END;
$$;

-- Fix the trigger function with proper search path
CREATE OR REPLACE FUNCTION public.log_profile_changes()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.log_user_activity('profile_created', to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM public.log_user_activity('profile_updated', jsonb_build_object(
      'old', to_jsonb(OLD),
      'new', to_jsonb(NEW)
    ));
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS profile_changes_log ON public.profiles;
CREATE TRIGGER profile_changes_log
  AFTER INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.log_profile_changes();