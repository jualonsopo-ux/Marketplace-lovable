-- Create test data and booking function

-- First, create a test profile
INSERT INTO public.profiles (id, user_id, full_name, handle, email, role)
VALUES (gen_random_uuid(), gen_random_uuid(), 'Coach Demo', 'coach-demo', 'coach@demo.com', 'coach');

-- Create a test coach (published)
INSERT INTO public.coaches (id, profile_id, display_name, bio, is_published, whatsapp_enabled)
SELECT 
  gen_random_uuid(),
  p.id,
  'Ana García',
  'Coach especializada en bienestar y desarrollo personal.',
  true,
  true
FROM public.profiles p WHERE p.handle = 'coach-demo';

-- Create an S1 offering for the test coach
INSERT INTO public.offerings (id, coach_id, title, type, duration_min, price, currency, is_active, position)
SELECT 
  gen_random_uuid(),
  c.id,
  'Sesión Descubrimiento (S1)',
  'S1',
  30,
  0,
  'EUR',
  true,
  1
FROM public.coaches c WHERE c.display_name = 'Ana García';

-- Create S1 booking function
CREATE OR REPLACE FUNCTION public.create_s1_booking(
  p_coach_id UUID,
  p_name TEXT,
  p_email TEXT,
  p_marketing_consent BOOLEAN DEFAULT false
)
RETURNS UUID AS $$
DECLARE
  v_offering_id UUID;
  v_booking_id UUID;
BEGIN
  -- Find S1 offering for the coach
  SELECT id INTO v_offering_id
  FROM public.offerings
  WHERE coach_id = p_coach_id 
    AND type = 'S1' 
    AND is_active = true
  LIMIT 1;

  IF v_offering_id IS NULL THEN
    RAISE EXCEPTION 'No active S1 offering found for coach %', p_coach_id;
  END IF;

  -- Create booking
  INSERT INTO public.bookings (
    id,
    coach_id,
    offering_id,
    name,
    email,
    marketing_consent,
    status
  ) VALUES (
    gen_random_uuid(),
    p_coach_id,
    v_offering_id,
    p_name,
    p_email,
    p_marketing_consent,
    'pending'
  ) RETURNING id INTO v_booking_id;

  RETURN v_booking_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;