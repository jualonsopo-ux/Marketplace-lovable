-- SOLUCIÓN SIMPLE: Recrear tablas vacías con esquema UUID correcto
-- Como coach_profiles y sessions están vacías, podemos recrearlas limpiamente

-- 1. Eliminar las tablas problemáticas (están vacías)
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS coach_profiles CASCADE;

-- 2. Recrear coach_profiles con UUID y estructura correcta
CREATE TABLE coach_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  total_reviews INTEGER DEFAULT 0,
  specializations TEXT[] DEFAULT '{}',
  bio TEXT NOT NULL,
  title TEXT NOT NULL,
  years_experience INTEGER DEFAULT 0,
  hourly_rate NUMERIC DEFAULT 75.0,
  total_sessions INTEGER DEFAULT 0,
  average_rating NUMERIC DEFAULT 0,
  response_time_hours INTEGER DEFAULT 24,
  instant_booking BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  currency TEXT DEFAULT 'EUR',
  verification_status TEXT DEFAULT 'pending',
  coaching_methods TEXT[] DEFAULT ARRAY['video', 'phone'],
  languages TEXT[] DEFAULT ARRAY['es']
);

-- 3. Recrear sessions con UUID y estructura correcta  
CREATE TABLE sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  description TEXT,
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled',
  type TEXT NOT NULL DEFAULT 'S1',
  session_type TEXT DEFAULT 'video',
  location TEXT,
  meeting_link TEXT,
  notes TEXT,
  coach_notes TEXT,
  client_notes TEXT,
  cancellation_reason TEXT,
  client_profile_id UUID,
  coach_profile_id UUID, -- Ahora UUID, consistente con coach_profiles.id
  cancelled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID NOT NULL,
  price_eur NUMERIC DEFAULT 0,
  calendar_id BIGINT NOT NULL DEFAULT 1,
  workspace_id BIGINT NOT NULL DEFAULT 1
);

-- 4. Habilitar RLS en las nuevas tablas
ALTER TABLE coach_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- 5. Recrear policies de RLS existentes
CREATE POLICY "Users can insert their own coach profile" 
ON coach_profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own coach profile" 
ON coach_profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own coach profile" 
ON coach_profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Coaches can create sessions" 
ON sessions FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM coach_profiles WHERE coach_profiles.user_id = auth.uid()));

CREATE POLICY "Users can view sessions they participate in" 
ON sessions FOR SELECT 
USING (
  auth.uid() = created_by OR 
  auth.uid() = client_profile_id OR 
  EXISTS (SELECT 1 FROM coach_profiles WHERE coach_profiles.id = sessions.coach_profile_id AND coach_profiles.user_id = auth.uid())
);

-- 6. Crear índices importantes
CREATE INDEX idx_coach_profiles_user_id ON coach_profiles(user_id);
CREATE INDEX idx_sessions_coach_profile ON sessions(coach_profile_id);
CREATE INDEX idx_sessions_client_profile ON sessions(client_profile_id);
CREATE INDEX idx_sessions_created_by ON sessions(created_by);

-- 7. Crear triggers para updated_at
CREATE TRIGGER update_coach_profiles_updated_at
  BEFORE UPDATE ON coach_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();