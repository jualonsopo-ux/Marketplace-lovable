-- MIGRACIÓN: Unificar IDs a UUID - Parte 2
-- Completar el intercambio de columnas y recrear constraints

-- 1. Eliminar primary keys existentes
ALTER TABLE coach_profiles DROP CONSTRAINT IF EXISTS coach_profiles_pkey;
ALTER TABLE sessions DROP CONSTRAINT IF EXISTS sessions_pkey;

-- 2. Intercambiar columnas en coach_profiles
ALTER TABLE coach_profiles DROP COLUMN id;
ALTER TABLE coach_profiles RENAME COLUMN new_id TO id;
ALTER TABLE coach_profiles ADD PRIMARY KEY (id);

-- 3. Intercambiar columnas en sessions
ALTER TABLE sessions DROP COLUMN id;
ALTER TABLE sessions RENAME COLUMN new_id TO id;
ALTER TABLE sessions ADD PRIMARY KEY (id);

-- 4. Intercambiar coach_profile_id en sessions
ALTER TABLE sessions DROP COLUMN coach_profile_id;
ALTER TABLE sessions RENAME COLUMN new_coach_profile_id TO coach_profile_id;

-- 5. Recrear índices importantes
CREATE INDEX IF NOT EXISTS idx_coach_profiles_user_id ON coach_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_coach_profile ON sessions(coach_profile_id);
CREATE INDEX IF NOT EXISTS idx_sessions_client_profile ON sessions(client_profile_id);

-- 6. Recrear foreign key constraints con tipos UUID correctos
ALTER TABLE sessions 
ADD CONSTRAINT sessions_coach_profile_id_fkey 
FOREIGN KEY (coach_profile_id) REFERENCES coach_profiles(id) ON DELETE SET NULL;

ALTER TABLE sessions 
ADD CONSTRAINT sessions_client_profile_id_fkey 
FOREIGN KEY (client_profile_id) REFERENCES profiles(id) ON DELETE SET NULL;