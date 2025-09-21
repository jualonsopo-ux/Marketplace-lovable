-- MIGRACIÓN: Verificar y limpiar TODAS las políticas RLS problemáticas

-- 1. Deshabilitar RLS temporalmente en las tablas afectadas
ALTER TABLE sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE coach_profiles DISABLE ROW LEVEL SECURITY;

-- 2. Eliminar EXPLÍCITAMENTE todas las políticas que puedan existir
DROP POLICY IF EXISTS "Users can view sessions they participate in" ON sessions;
DROP POLICY IF EXISTS "Coaches can create sessions" ON sessions;
DROP POLICY IF EXISTS "Users can view their own coach profile" ON coach_profiles;
DROP POLICY IF EXISTS "Users can insert their own coach profile" ON coach_profiles;  
DROP POLICY IF EXISTS "Users can update their own coach profile" ON coach_profiles;

-- 3. Verificar que no hay más políticas (eliminar cualquiera que pueda existir)
-- Usar CASCADE en DROP COLUMN para eliminar automáticamente dependencias
ALTER TABLE coach_profiles DROP COLUMN id CASCADE;
ALTER TABLE coach_profiles RENAME COLUMN new_id TO id;
ALTER TABLE coach_profiles ADD PRIMARY KEY (id);

ALTER TABLE sessions DROP COLUMN id CASCADE;
ALTER TABLE sessions RENAME COLUMN new_id TO id; 
ALTER TABLE sessions ADD PRIMARY KEY (id);

ALTER TABLE sessions DROP COLUMN coach_profile_id CASCADE;
ALTER TABLE sessions RENAME COLUMN new_coach_profile_id TO coach_profile_id;

-- 4. Recrear índices
CREATE INDEX IF NOT EXISTS idx_coach_profiles_user_id ON coach_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_coach_profile ON sessions(coach_profile_id);

-- 5. Rehabilitar RLS
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_profiles ENABLE ROW LEVEL SECURITY;