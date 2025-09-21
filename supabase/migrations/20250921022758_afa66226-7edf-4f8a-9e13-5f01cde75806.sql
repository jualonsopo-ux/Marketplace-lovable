-- Update the trigger function to use role from metadata if provided
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'client')::user_role_enum
  );
  RETURN NEW;
END;
$$;

-- Create the admin user directly
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_confirm,
  last_sign_in_at
) VALUES (
  gen_random_uuid(),
  'jualonospo@gmail.com',
  crypt('admin123456', gen_salt('bf')),
  now(),
  '{"full_name": "Admin User", "role": "admin"}'::jsonb,
  now(),
  now(),
  '',
  true,
  now()
);

-- Manually trigger profile creation for the admin user
INSERT INTO public.profiles (
  id,
  user_id,
  full_name,
  handle,
  email,
  role
) 
SELECT 
  gen_random_uuid(),
  u.id,
  'Admin User',
  'admin_user',
  'jualonospo@gmail.com',
  'admin'::user_role_enum
FROM auth.users u 
WHERE u.email = 'jualonospo@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.user_id = u.id
);