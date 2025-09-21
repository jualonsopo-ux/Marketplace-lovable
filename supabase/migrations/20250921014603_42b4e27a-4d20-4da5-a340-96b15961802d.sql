-- Update jualonsopo@gmail.com to admin role
UPDATE public.profiles 
SET role = 'admin'::user_role_enum 
WHERE user_id = 'd0a4772e-46d9-429a-90c2-c114378ffda6';