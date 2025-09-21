-- RESTAURAR POLÍTICAS DE SEGURIDAD (verificando existencia)
-- Solo recrear lo que falta y arreglar funciones

-- 1. Arreglar funciones con search_path mutable (DROP and CREATE para asegurar cambios)
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
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

DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
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

-- 2. Recrear trigger si no existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Crear función helper si no existe
CREATE OR REPLACE FUNCTION public.get_current_user_profile_id()
RETURNS UUID
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT id FROM profiles WHERE user_id = auth.uid();
$$;

-- 4. Solo agregar políticas que faltan (usando DROP IF EXISTS primero)
DROP POLICY IF EXISTS "Users can view sessions they participate in" ON sessions;
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

DROP POLICY IF EXISTS "Coaches can create sessions" ON sessions;
CREATE POLICY "Coaches can create sessions"
ON sessions FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM coach_profiles cp
    WHERE cp.user_id = auth.uid()
  )
);