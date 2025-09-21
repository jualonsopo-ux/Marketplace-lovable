-- Crear usuarios de ejemplo con diferentes roles
-- Primero, vamos a actualizar la función para asegurar que funcione correctamente

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

-- Crear trigger si no existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Función para actualizar roles en auth.users
CREATE OR REPLACE FUNCTION update_user_role(user_email text, new_role text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id uuid;
  current_metadata jsonb;
BEGIN
  -- Obtener el user_id y metadata actual
  SELECT id, raw_user_meta_data INTO user_id, current_metadata
  FROM auth.users 
  WHERE email = user_email;
  
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'Usuario no encontrado: %', user_email;
  END IF;
  
  -- Actualizar metadata en auth.users
  UPDATE auth.users 
  SET raw_user_meta_data = jsonb_set(
    COALESCE(current_metadata, '{}'::jsonb), 
    '{role}', 
    to_jsonb(new_role)
  )
  WHERE id = user_id;
  
  -- Actualizar rol en profiles
  UPDATE profiles 
  SET role = new_role::user_role_enum
  WHERE user_id = user_id;
END;
$$;