-- MIGRACIÓN: Unificar IDs a UUID - Parte 2 (Con políticas RLS)
-- Manejar dependencias de políticas RLS

-- 1. Eliminar temporalmente las políticas RLS que dependen de las columnas
DROP POLICY IF EXISTS "Users can view sessions they participate in" ON sessions;
DROP POLICY IF EXISTS "Coaches can create sessions" ON sessions;
DROP POLICY IF EXISTS "Users can view their own coach profile" ON coach_profiles;
DROP POLICY IF EXISTS "Users can insert their own coach profile" ON coach_profiles;  
DROP POLICY IF EXISTS "Users can update their own coach profile" ON coach_profiles;

-- 2. Eliminar primary keys existentes
ALTER TABLE coach_profiles DROP CONSTRAINT IF EXISTS coach_profiles_pkey;
ALTER TABLE sessions DROP CONSTRAINT IF EXISTS sessions_pkey;

-- 3. Intercambiar columnas en coach_profiles
ALTER TABLE coach_profiles DROP COLUMN id CASCADE;
ALTER TABLE coach_profiles RENAME COLUMN new_id TO id;
ALTER TABLE coach_profiles ADD PRIMARY KEY (id);

-- 4. Intercambiar columnas en sessions  
ALTER TABLE sessions DROP COLUMN id CASCADE;
ALTER TABLE sessions RENAME COLUMN new_id TO id;
ALTER TABLE sessions ADD PRIMARY KEY (id);

-- 5. Intercambiar coach_profile_id en sessions
ALTER TABLE sessions DROP COLUMN coach_profile_id CASCADE;
ALTER TABLE sessions RENAME COLUMN new_coach_profile_id TO coach_profile_id;

-- 6. Recrear índices importantes
CREATE INDEX IF NOT EXISTS idx_coach_profiles_user_id ON coach_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_coach_profile ON sessions(coach_profile_id);
CREATE INDEX IF NOT EXISTS idx_sessions_client_profile ON sessions(client_profile_id);

-- 7. Recrear foreign key constraints con tipos UUID correctos
ALTER TABLE sessions 
ADD CONSTRAINT sessions_coach_profile_id_fkey 
FOREIGN KEY (coach_profile_id) REFERENCES coach_profiles(id) ON DELETE SET NULL;

ALTER TABLE sessions 
ADD CONSTRAINT sessions_client_profile_id_fkey 
FOREIGN KEY (client_profile_id) REFERENCES profiles(id) ON DELETE SET NULL;