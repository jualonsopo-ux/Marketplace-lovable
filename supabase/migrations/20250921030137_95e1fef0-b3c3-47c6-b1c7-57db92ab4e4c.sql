-- MIGRACIÓN: Recrear políticas RLS esenciales después de la conversión UUID
-- Esto soluciona las alertas de seguridad detectadas

-- 1. Recrear políticas para coach_profiles
CREATE POLICY "Users can view their own coach profile" 
ON coach_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own coach profile" 
ON coach_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own coach profile" 
ON coach_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- 2. Recrear políticas para sessions
CREATE POLICY "Users can view sessions they participate in" 
ON sessions 
FOR SELECT 
USING (
  auth.uid() = created_by OR 
  auth.uid() = client_profile_id OR 
  EXISTS (
    SELECT 1 FROM coach_profiles 
    WHERE coach_profiles.id = sessions.coach_profile_id 
      AND coach_profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Coaches can create sessions" 
ON sessions 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM coach_profiles 
    WHERE coach_profiles.user_id = auth.uid()
  )
);

-- 3. Habilitar RLS en tablas que lo necesitan si no está habilitado
ALTER TABLE coach_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- 4. Verificar la integridad de los datos después de la migración
-- Crear función de verificación para IDs UUID
CREATE OR REPLACE FUNCTION verify_uuid_consistency()
RETURNS TABLE(table_name TEXT, uuid_columns INTEGER, total_records INTEGER) 
LANGUAGE SQL 
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 'profiles'::TEXT, 
         COUNT(*) FILTER (WHERE id::TEXT ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'),
         COUNT(*)::INTEGER
  FROM profiles
  UNION ALL
  SELECT 'coaches'::TEXT,
         COUNT(*) FILTER (WHERE id::TEXT ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'),
         COUNT(*)::INTEGER
  FROM coaches
  UNION ALL
  SELECT 'coach_profiles'::TEXT,
         COUNT(*) FILTER (WHERE id::TEXT ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'),
         COUNT(*)::INTEGER
  FROM coach_profiles
  UNION ALL
  SELECT 'sessions'::TEXT,
         COUNT(*) FILTER (WHERE id::TEXT ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'),
         COUNT(*)::INTEGER
  FROM sessions;
$$;