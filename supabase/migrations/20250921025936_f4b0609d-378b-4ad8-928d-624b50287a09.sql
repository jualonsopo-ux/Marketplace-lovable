-- MIGRACIÓN: Unificar IDs a UUID - Parte 1
-- Primero eliminar constraints que bloquean la migración

-- 1. Identificar y eliminar foreign key constraints que dependen de las primary keys
ALTER TABLE sessions DROP CONSTRAINT IF EXISTS sessions_coach_profile_id_fkey;
ALTER TABLE sessions DROP CONSTRAINT IF EXISTS sessions_client_profile_id_fkey;

-- 2. Crear nuevas columnas UUID para las tablas que necesitan conversión
ALTER TABLE coach_profiles ADD COLUMN IF NOT EXISTS new_id UUID DEFAULT gen_random_uuid();
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS new_id UUID DEFAULT gen_random_uuid();

-- 3. Poblar las nuevas columnas UUID
UPDATE coach_profiles SET new_id = gen_random_uuid() WHERE new_id IS NULL;
UPDATE sessions SET new_id = gen_random_uuid() WHERE new_id IS NULL;

-- 4. Crear tabla temporal de mapeo para mantener relaciones
CREATE TEMP TABLE IF NOT EXISTS coach_profile_mapping AS 
SELECT id as old_bigint_id, new_id as new_uuid_id FROM coach_profiles;

-- 5. Agregar nueva columna UUID para coach_profile_id en sessions
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS new_coach_profile_id UUID;

-- 6. Mapear las relaciones usando UUIDs
UPDATE sessions 
SET new_coach_profile_id = cpm.new_uuid_id
FROM coach_profile_mapping cpm 
WHERE sessions.coach_profile_id = cpm.old_bigint_id;