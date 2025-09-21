-- RESTAURAR POLÍTICAS DE SEGURIDAD RLS
-- Recrear las políticas que se eliminaron durante la unificación de IDs

-- 1. Crear función helper para evitar recursión en RLS
CREATE OR REPLACE FUNCTION public.get_current_user_profile_id()
RETURNS UUID
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT id FROM profiles WHERE user_id = auth.uid();
$$;

-- 2. Políticas para coach_profiles
CREATE POLICY "Users can view their own coach profile"
ON coach_profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own coach profile"  
ON coach_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own coach profile"
ON coach_profiles FOR UPDATE  
USING (auth.uid() = user_id);

-- 3. Políticas para sessions
CREATE POLICY "Users can view sessions they participate in"
ON sessions FOR SELECT
USING (
  auth.uid() = created_by OR 
  auth.uid() = client_profile_id OR 
  EXISTS (
    SELECT 1 FROM coach_profiles cp 
    WHERE cp.id = sessions.coach_profile_id 
    AND cp.user_id = auth.uid()
  )
);

CREATE POLICY "Coaches can create sessions"
ON sessions FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM coach_profiles cp
    WHERE cp.user_id = auth.uid()
  )
);

-- 4. Arreglar funciones con search_path mutable
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER  
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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