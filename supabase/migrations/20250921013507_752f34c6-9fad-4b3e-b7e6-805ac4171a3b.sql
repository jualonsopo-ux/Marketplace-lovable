-- Ensure profiles table has all necessary columns for the three-role system
-- Add any missing columns that might be needed

-- First, let's make sure we have proper role enum
DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM ('client', 'coach', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update profiles table to ensure it supports our three-role system
ALTER TABLE public.profiles 
ALTER COLUMN role TYPE user_role_enum USING role::user_role_enum;

-- Ensure admin users can have profiles
CREATE POLICY "Admin users can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() AND p.role = 'admin'
  )
);

-- Ensure admin users can manage all profiles
CREATE POLICY "Admin users can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() AND p.role = 'admin'
  )
);

-- Update coach_profiles policies to allow admin access
CREATE POLICY "Admin can view all coach profiles" 
ON public.coach_profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() AND p.role = 'admin'
  )
);

CREATE POLICY "Admin can manage all coach profiles" 
ON public.coach_profiles 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() AND p.role = 'admin'
  )
);

-- Update sessions policies to allow admin access
CREATE POLICY "Admin can view all sessions" 
ON public.sessions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() AND p.role = 'admin'
  )
);

-- Update reviews policies to allow admin access
CREATE POLICY "Admin can view all reviews" 
ON public.reviews 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() AND p.role = 'admin'
  )
);

-- Create a view for dashboard statistics that admins can access
CREATE OR REPLACE VIEW public.platform_stats AS
SELECT 
  (SELECT COUNT(*) FROM public.profiles) AS total_users,
  (SELECT COUNT(*) FROM public.profiles WHERE role = 'coach') AS total_coaches,
  (SELECT COUNT(*) FROM public.profiles WHERE role = 'client') AS total_clients,
  (SELECT COUNT(*) FROM public.coach_profiles WHERE is_active = true) AS active_coaches,
  (SELECT COUNT(*) FROM public.sessions) AS total_sessions,
  (SELECT COUNT(*) FROM public.sessions WHERE status = 'completed') AS completed_sessions,
  (SELECT COALESCE(SUM(price_eur), 0) FROM public.sessions WHERE status = 'completed') AS total_revenue;

-- RLS policy for platform stats (admin only)
ALTER VIEW public.platform_stats SET (security_barrier = true);

-- Grant access to platform stats for admins
CREATE POLICY "Admin can view platform stats" 
ON public.platform_stats 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() AND p.role = 'admin'
  )
);

-- Create activity log table for admin monitoring
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on activity logs
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view activity logs
CREATE POLICY "Admin can view activity logs" 
ON public.activity_logs 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() AND p.role = 'admin'
  )
);

-- Function to log user activities
CREATE OR REPLACE FUNCTION public.log_user_activity(
  action_text TEXT,
  details_json JSONB DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
  INSERT INTO public.activity_logs (user_id, action, details)
  VALUES (auth.uid(), action_text, details_json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically log profile updates
CREATE OR REPLACE FUNCTION public.log_profile_changes()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Create trigger for profile changes
DROP TRIGGER IF EXISTS profile_changes_log ON public.profiles;
CREATE TRIGGER profile_changes_log
  AFTER INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.log_profile_changes();

-- Ensure proper indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_coach_profiles_active ON public.coach_profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON public.sessions(status);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_created ON public.activity_logs(user_id, created_at DESC);