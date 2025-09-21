-- Fix authentication setup for profiles table

-- First, make user_id NOT NULL and add proper foreign key
ALTER TABLE public.profiles 
ALTER COLUMN user_id SET NOT NULL,
ADD CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create unique index on user_id to ensure one profile per user
CREATE UNIQUE INDEX IF NOT EXISTS profiles_user_id_unique ON public.profiles(user_id);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    user_id,
    full_name,
    handle,
    email,
    role
  ) VALUES (
    gen_random_uuid(),
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    LOWER(REPLACE(COALESCE(NEW.raw_user_meta_data ->> 'full_name', split_part(NEW.email, '@', 1)), ' ', '_')),
    NEW.email,
    'client'
  );
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create some test users for demo
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES 
  (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'cliente@test.com',
    crypt('test123456', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Cliente Test"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'coach@test.com',
    crypt('test123456', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Coach Test"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  )
ON CONFLICT (email) DO NOTHING;

-- Update existing coach test user to have coach role
UPDATE public.profiles 
SET role = 'coach' 
WHERE email = 'coach@test.com';