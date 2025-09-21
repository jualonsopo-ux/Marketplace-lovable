-- MIGRACIÓN CORREGIDA: Unificar IDs a UUID manejando dependencias
-- Paso 1: Eliminar foreign key constraints que impiden cambios

-- Verificar y eliminar constraints de foreign key existentes
ALTER TABLE sessions DROP CONSTRAINT IF EXISTS sessions_coach_profile_id_fkey CASCADE;

-- Paso 2: Agregar columnas temporales UUID
ALTER TABLE coach_profiles ADD COLUMN IF NOT EXISTS temp_uuid_id UUID DEFAULT gen_random_uuid();
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS temp_uuid_id UUID DEFAULT gen_random_uuid();
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS temp_coach_profile_uuid UUID;

-- Paso 3: Poblar las nuevas columnas
UPDATE coach_profiles SET temp_uuid_id = gen_random_uuid() WHERE temp_uuid_id IS NULL;
UPDATE sessions SET temp_uuid_id = gen_random_uuid() WHERE temp_uuid_id IS NULL;

-- Crear mapeo para mantener relaciones coach_profiles -> sessions
CREATE TEMP TABLE IF NOT EXISTS id_mapping AS 
SELECT 
  id as old_bigint_id, 
  temp_uuid_id as new_uuid_id 
FROM coach_profiles;

-- Actualizar sessions con los nuevos UUIDs de coach_profiles
UPDATE sessions s
SET temp_coach_profile_uuid = m.new_uuid_id
FROM id_mapping m 
WHERE s.coach_profile_id = m.old_bigint_id;

-- Paso 4: Intercambiar columnas en coach_profiles
ALTER TABLE coach_profiles DROP CONSTRAINT IF EXISTS coach_profiles_pkey CASCADE;
ALTER TABLE coach_profiles DROP COLUMN id CASCADE;
ALTER TABLE coach_profiles RENAME COLUMN temp_uuid_id TO id;
ALTER TABLE coach_profiles ADD PRIMARY KEY (id);

-- Paso 5: Intercambiar columnas en sessions
ALTER TABLE sessions DROP CONSTRAINT IF EXISTS sessions_pkey CASCADE;
ALTER TABLE sessions DROP COLUMN id CASCADE;
ALTER TABLE sessions DROP COLUMN coach_profile_id CASCADE;
ALTER TABLE sessions RENAME COLUMN temp_uuid_id TO id;
ALTER TABLE sessions RENAME COLUMN temp_coach_profile_uuid TO coach_profile_id;
ALTER TABLE sessions ADD PRIMARY KEY (id);

-- Paso 6: Recrear índices y constraints importantes
CREATE INDEX IF NOT EXISTS idx_coach_profiles_user_id ON coach_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_coach_profile ON sessions(coach_profile_id);
CREATE INDEX IF NOT EXISTS idx_sessions_client_profile ON sessions(client_profile_id);

-- Paso 7: Verificar consistencia final
DO $$
BEGIN
  -- Log de verificación
  RAISE NOTICE 'Migration completed. coach_profiles.id type: %', 
    (SELECT data_type FROM information_schema.columns 
     WHERE table_name = 'coach_profiles' AND column_name = 'id');
  RAISE NOTICE 'sessions.id type: %', 
    (SELECT data_type FROM information_schema.columns 
     WHERE table_name = 'sessions' AND column_name = 'id');
END $$;