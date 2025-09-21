-- Step 1: Drop existing policies that might conflict
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;  
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Step 2: Create enum type if it doesn't exist
DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM ('client', 'coach', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Step 3: Add admin role support
-- Since we can't easily change the existing column type, let's work with the current text type
-- and add admin support through policies

-- Step 4: Recreate basic policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Step 5: Add admin access policies
CREATE POLICY "Admin users can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() AND p.role = 'admin'
  )
);

CREATE POLICY "Admin users can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() AND p.role = 'admin'
  )
);

-- Step 6: Add admin access to coach profiles
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

-- Step 7: Admin access to sessions
CREATE POLICY "Admin can view all sessions" 
ON public.sessions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() AND p.role = 'admin'
  )
);

-- Step 8: Admin access to reviews
CREATE POLICY "Admin can view all reviews" 
ON public.reviews 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() AND p.role = 'admin'
  )
);

-- Step 9: Create activity logs table for admin monitoring
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can view activity logs" 
ON public.activity_logs 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() AND p.role = 'admin'
  )
);

-- Step 10: Add performance indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON public.activity_logs(created_at DESC);

-- Step 11: Function to create an admin user (for initial setup)
CREATE OR REPLACE FUNCTION public.create_admin_user(admin_email TEXT)
RETURNS TEXT AS $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Find user by email in auth.users (admin only function)
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = admin_email;
  
  IF admin_user_id IS NULL THEN
    RETURN 'User not found with email: ' || admin_email;
  END IF;
  
  -- Update or insert admin profile
  INSERT INTO public.profiles (user_id, role, display_name)
  VALUES (admin_user_id, 'admin', 'Administrator')
  ON CONFLICT (user_id) 
  DO UPDATE SET role = 'admin';
  
  RETURN 'Admin user created successfully for: ' || admin_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;