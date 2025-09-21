-- Test booking creation to verify RLS policies work
DO $$
DECLARE
  v_coach_id UUID;
  v_offering_id UUID;
  v_booking_id UUID;
BEGIN
  -- Get the test coach and offering
  SELECT id INTO v_coach_id FROM public.coaches WHERE is_published LIMIT 1;
  SELECT id INTO v_offering_id FROM public.offerings WHERE coach_id = v_coach_id AND type = 'S1' LIMIT 1;
  
  -- Test public booking creation (should work due to RLS policy)
  INSERT INTO public.bookings (
    id, coach_id, offering_id, name, email, marketing_consent, status
  ) VALUES (
    gen_random_uuid(), v_coach_id, v_offering_id, 'Usuario Demo', 'demo@example.com', true, 'pending'
  );
  
  RAISE NOTICE 'Booking created successfully! Coach ID: %, Offering ID: %', v_coach_id, v_offering_id;
END $$;