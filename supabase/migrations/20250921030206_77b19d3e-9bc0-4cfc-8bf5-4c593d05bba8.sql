-- MIGRACIÓN: Unificar IDs a UUID - Parte 2 (Enfoque completo)
-- Eliminar TODAS las dependencias primero

-- 1. Eliminar TODAS las foreign keys que puedan estar causando problemas
ALTER TABLE sessions DROP CONSTRAINT IF EXISTS sessions_coach_profile_id_fkey CASCADE;
ALTER TABLE sessions DROP CONSTRAINT IF EXISTS sessions_client_profile_id_fkey CASCADE;

-- 2. Eliminar primary keys con CASCADE para forzar la eliminación
ALTER TABLE coach_profiles DROP CONSTRAINT IF EXISTS coach_profiles_pkey CASCADE;
ALTER TABLE sessions DROP CONSTRAINT IF EXISTS sessions_pkey CASCADE;

-- 3. Hacer el intercambio de columnas  
ALTER TABLE coach_profiles DROP COLUMN id;
ALTER TABLE coach_profiles RENAME COLUMN new_id TO id;
ALTER TABLE coach_profiles ADD PRIMARY KEY (id);

ALTER TABLE sessions DROP COLUMN id; 
ALTER TABLE sessions RENAME COLUMN new_id TO id;
ALTER TABLE sessions ADD PRIMARY KEY (id);

ALTER TABLE sessions DROP COLUMN coach_profile_id;
ALTER TABLE sessions RENAME COLUMN new_coach_profile_id TO coach_profile_id;

-- 4. Recrear constraints y índices
CREATE INDEX IF NOT EXISTS idx_coach_profiles_user_id ON coach_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_coach_profile ON sessions(coach_profile_id);
CREATE INDEX IF NOT EXISTS idx_sessions_client_profile ON sessions(client_profile_id);

-- 5. Recrear foreign keys con tipos UUID
ALTER TABLE sessions 
ADD CONSTRAINT sessions_coach_profile_id_fkey 
FOREIGN KEY (coach_profile_id) REFERENCES coach_profiles(id) ON DELETE SET NULL;

ALTER TABLE sessions 
ADD CONSTRAINT sessions_client_profile_id_fkey 
FOREIGN KEY (client_profile_id) REFERENCES profiles(id) ON DELETE SET NULL;