-- MIGRACIÓN COMPLETA: Unificar IDs a UUID desde cero
-- Verificar estado actual y proceder según sea necesario

-- 1. Agregar columnas UUID si no existen
ALTER TABLE coach_profiles ADD COLUMN IF NOT EXISTS uuid_id UUID DEFAULT gen_random_uuid();
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS uuid_id UUID DEFAULT gen_random_uuid();

-- 2. Poblar los nuevos UUIDs
UPDATE coach_profiles SET uuid_id = gen_random_uuid() WHERE uuid_id IS NULL;
UPDATE sessions SET uuid_id = gen_random_uuid() WHERE uuid_id IS NULL;

-- 3. Crear tabla de mapeo para coach_profiles
CREATE TEMP TABLE coach_mapping AS 
SELECT id as old_id, uuid_id as new_id FROM coach_profiles;

-- 4. Agregar nueva columna para coach_profile_id en sessions
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS uuid_coach_profile_id UUID;

-- 5. Mapear relaciones
UPDATE sessions 
SET uuid_coach_profile_id = cm.new_id
FROM coach_mapping cm
WHERE sessions.coach_profile_id = cm.old_id;

-- 6. Deshabilitar RLS y eliminar políticas
ALTER TABLE sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE coach_profiles DISABLE ROW LEVEL SECURITY;

-- 7. Intercambiar columnas (usando nombres únicos para evitar conflictos)
ALTER TABLE coach_profiles DROP COLUMN id CASCADE;
ALTER TABLE coach_profiles RENAME COLUMN uuid_id TO id;
ALTER TABLE coach_profiles ADD PRIMARY KEY (id);

ALTER TABLE sessions DROP COLUMN id CASCADE;
ALTER TABLE sessions RENAME COLUMN uuid_id TO id;
ALTER TABLE sessions ADD PRIMARY KEY (id);

ALTER TABLE sessions DROP COLUMN coach_profile_id CASCADE;
ALTER TABLE sessions RENAME COLUMN uuid_coach_profile_id TO coach_profile_id;

-- 8. Rehabilitar RLS
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_profiles ENABLE ROW LEVEL SECURITY;