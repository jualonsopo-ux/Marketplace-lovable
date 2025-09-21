-- Create sample user profiles for testing different roles
-- Note: These are for development/testing only

-- First, let's clean up any existing test data
DELETE FROM public.profiles WHERE email LIKE '%@test.%';

-- Insert sample profiles for each role type
INSERT INTO public.profiles (
  id,
  user_id,
  full_name,
  handle,
  email,
  role,
  display_name,
  bio,
  phone,
  timezone,
  is_active
) VALUES 
  -- Admin user
  (
    gen_random_uuid(),
    gen_random_uuid(),
    'María Rodríguez',
    'maria_admin',
    'admin@test.com',
    'admin',
    'María R.',
    'Administradora del sistema de coaching',
    '+34 600 123 456',
    'Europe/Madrid',
    true
  ),
  -- Coach user
  (
    gen_random_uuid(),
    gen_random_uuid(),
    'Carlos Sánchez',
    'carlos_coach',
    'coach@test.com',
    'coach',
    'Carlos S.',
    'Coach especializado en liderazgo y desarrollo personal con 10 años de experiencia',
    '+34 600 234 567',
    'Europe/Madrid',
    true
  ),
  -- Psychologist user  
  (
    gen_random_uuid(),
    gen_random_uuid(),
    'Dr. Ana López',
    'ana_psychologist',
    'psychologist@test.com',
    'psychologist',
    'Dra. Ana L.',
    'Psicóloga clínica especializada en terapia cognitivo-conductual',
    '+34 600 345 678',
    'Europe/Madrid',
    true
  ),
  -- Staff user
  (
    gen_random_uuid(),
    gen_random_uuid(),
    'Laura Martín',
    'laura_staff',
    'staff@test.com',
    'staff',
    'Laura M.',
    'Coordinadora de servicios de apoyo al cliente',
    '+34 600 456 789',
    'Europe/Madrid',
    true
  ),
  -- Client user
  (
    gen_random_uuid(),
    gen_random_uuid(),
    'Juan Pérez',
    'juan_client',
    'client@test.com',
    'client',
    'Juan P.',
    'Cliente interesado en coaching de carrera profesional',
    '+34 600 567 890',
    'Europe/Madrid',
    true
  );