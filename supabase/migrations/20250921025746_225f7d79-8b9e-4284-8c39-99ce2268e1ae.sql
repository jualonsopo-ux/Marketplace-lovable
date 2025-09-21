-- MIGRACIÓN: Unificar todos los IDs a UUID para consistencia
-- Esta migración corrige las inconsistencias de tipos de ID

-- 1. Primero, crear nuevas columnas UUID para las tablas con bigint
ALTER TABLE coach_profiles ADD COLUMN new_id UUID DEFAULT gen_random_uuid();
ALTER TABLE sessions ADD COLUMN new_id UUID DEFAULT gen_random_uuid();

-- 2. Poblar las nuevas columnas UUID para mantener referencias
UPDATE coach_profiles SET new_id = gen_random_uuid();
UPDATE sessions SET new_id = gen_random_uuid();

-- 3. Crear tabla de mapeo temporal para coach_profiles (para mantener referencias en sessions)
CREATE TEMP TABLE coach_profile_id_mapping AS 
SELECT id as old_id, new_id FROM coach_profiles;

-- 4. Actualizar sessions.coach_profile_id para usar el nuevo UUID
-- Primero agregar nueva columna UUID para coach_profile_id
ALTER TABLE sessions ADD COLUMN new_coach_profile_id UUID;

-- Mapear los IDs usando la tabla temporal
UPDATE sessions 
SET new_coach_profile_id = m.new_id
FROM coach_profile_id_mapping m 
WHERE sessions.coach_profile_id = m.old_id;

-- 5. Eliminar constraints existentes si los hay
DROP INDEX IF EXISTS idx_coach_profiles_user_id;
DROP INDEX IF EXISTS idx_sessions_coach_profile;

-- 6. Ahora intercambiar las columnas en coach_profiles
ALTER TABLE coach_profiles DROP CONSTRAINT IF EXISTS coach_profiles_pkey;
ALTER TABLE coach_profiles DROP COLUMN id;
ALTER TABLE coach_profiles RENAME COLUMN new_id TO id;
ALTER TABLE coach_profiles ADD PRIMARY KEY (id);

-- 7. Intercambiar columnas en sessions  
ALTER TABLE sessions DROP CONSTRAINT IF EXISTS sessions_pkey;
ALTER TABLE sessions DROP COLUMN id;
ALTER TABLE sessions RENAME COLUMN new_id TO id;
ALTER TABLE sessions DROP COLUMN coach_profile_id;
ALTER TABLE sessions RENAME COLUMN new_coach_profile_id TO coach_profile_id;
ALTER TABLE sessions ADD PRIMARY KEY (id);

-- 8. Recrear índices importantes
CREATE INDEX idx_coach_profiles_user_id ON coach_profiles(user_id);
CREATE INDEX idx_sessions_coach_profile ON sessions(coach_profile_id);
CREATE INDEX idx_sessions_client_profile ON sessions(client_profile_id);

-- 9. Verificar que no hay tablas duplicadas innecesarias
-- La tabla 'coaches' ya usa UUID correctamente y puede coexistir con 'coach_profiles'
-- pero vamos a asegurar consistencia en las foreign keys

-- 10. Actualizar triggers si los hay
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Recrear triggers para updated_at
DROP TRIGGER IF EXISTS update_coach_profiles_updated_at ON coach_profiles;
CREATE TRIGGER update_coach_profiles_updated_at
  BEFORE UPDATE ON coach_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_sessions_updated_at ON sessions;  
CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();