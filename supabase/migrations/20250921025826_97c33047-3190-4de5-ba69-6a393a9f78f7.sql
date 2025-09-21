-- MIGRACIÓN SIMPLIFICADA: Corregir inconsistencias de ID
-- Sin verificaciones complejas que causan errores

-- Paso 1: Eliminar constraints problemáticos
ALTER TABLE sessions DROP CONSTRAINT IF EXISTS sessions_coach_profile_id_fkey CASCADE;

-- Paso 2: Para coach_profiles - convertir de bigint a UUID
DO $$
DECLARE 
    rec RECORD;
    new_uuid UUID;
BEGIN
    -- Si coach_profiles ya tiene algunas columnas temp, limpiarlas
    ALTER TABLE coach_profiles DROP COLUMN IF EXISTS temp_uuid_id CASCADE;
    ALTER TABLE sessions DROP COLUMN IF EXISTS temp_coach_profile_uuid CASCADE;
    
    -- Agregar nueva columna UUID
    ALTER TABLE coach_profiles ADD COLUMN temp_uuid_id UUID DEFAULT gen_random_uuid();
    ALTER TABLE sessions ADD COLUMN temp_coach_profile_uuid UUID;
    
    -- Poblar UUIDs
    UPDATE coach_profiles SET temp_uuid_id = gen_random_uuid();
    
    -- Mapear relaciones existentes
    FOR rec IN SELECT id, temp_uuid_id FROM coach_profiles LOOP
        UPDATE sessions 
        SET temp_coach_profile_uuid = rec.temp_uuid_id 
        WHERE coach_profile_id = rec.id;
    END LOOP;
    
    -- Intercambiar columnas en coach_profiles
    ALTER TABLE coach_profiles DROP CONSTRAINT IF EXISTS coach_profiles_pkey CASCADE;
    ALTER TABLE coach_profiles DROP COLUMN id;
    ALTER TABLE coach_profiles RENAME COLUMN temp_uuid_id TO id;
    ALTER TABLE coach_profiles ADD PRIMARY KEY (id);
    
    -- Intercambiar en sessions
    ALTER TABLE sessions DROP COLUMN coach_profile_id;
    ALTER TABLE sessions RENAME COLUMN temp_coach_profile_uuid TO coach_profile_id;
    
END $$;

-- Paso 3: Para sessions - convertir ID principal de bigint a UUID  
ALTER TABLE sessions DROP CONSTRAINT IF EXISTS sessions_pkey CASCADE;
ALTER TABLE sessions ADD COLUMN temp_session_uuid UUID DEFAULT gen_random_uuid();
UPDATE sessions SET temp_session_uuid = gen_random_uuid();
ALTER TABLE sessions DROP COLUMN id;
ALTER TABLE sessions RENAME COLUMN temp_session_uuid TO id;
ALTER TABLE sessions ADD PRIMARY KEY (id);

-- Paso 4: Recrear índices básicos
CREATE INDEX idx_coach_profiles_user_id ON coach_profiles(user_id);
CREATE INDEX idx_sessions_coach_profile ON sessions(coach_profile_id);
CREATE INDEX idx_sessions_client_profile ON sessions(client_profile_id);