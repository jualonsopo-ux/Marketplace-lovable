-- Migración cuidadosa del esquema CRM
-- Manejar la conversión de enum role de forma segura

-- 1. Crear el nuevo enum
DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM ('client', 'coach', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Crear otros enums necesarios
DO $$ BEGIN
    CREATE TYPE session_type_enum AS ENUM ('S1', 'S2', 'follow_up', 'consultation');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE session_status_enum AS ENUM ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Crear tabla workspaces
CREATE TABLE IF NOT EXISTS public.workspaces (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT workspaces_pkey PRIMARY KEY (id)
);

-- 4. Insertar workspace por defecto
INSERT INTO public.workspaces (name) 
SELECT 'Default Workspace' 
WHERE NOT EXISTS (SELECT 1 FROM public.workspaces);

-- 5. Añadir nueva columna role_new con el nuevo enum
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role_new user_role_enum;

-- 6. Migrar datos del enum antiguo al nuevo
UPDATE public.profiles SET role_new = 
  CASE 
    WHEN role::text = 'coach' THEN 'coach'::user_role_enum
    WHEN role::text = 'admin' THEN 'admin'::user_role_enum  
    WHEN role::text = 'psychologist' THEN 'coach'::user_role_enum
    WHEN role::text = 'staff' THEN 'client'::user_role_enum
    ELSE 'client'::user_role_enum
  END;

-- 7. Eliminar columna antigua y renombrar la nueva
ALTER TABLE public.profiles DROP COLUMN role;
ALTER TABLE public.profiles RENAME COLUMN role_new TO role;

-- 8. Establecer default para la nueva columna
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'client'::user_role_enum;
ALTER TABLE public.profiles ALTER COLUMN role SET NOT NULL;

-- 9. Renombrar auth_user_id a user_id
ALTER TABLE public.profiles RENAME COLUMN auth_user_id TO user_id;

-- 10. Añadir columnas faltantes a profiles si no existen
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS display_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS timezone text DEFAULT 'Europe/Madrid';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS language text DEFAULT 'es';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email_notifications boolean DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS push_notifications boolean DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS marketing_emails boolean DEFAULT false;

-- 11. Crear tabla coach_profiles
CREATE TABLE IF NOT EXISTS public.coach_profiles (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid NOT NULL UNIQUE,
  title text NOT NULL,
  bio text NOT NULL,
  years_experience integer DEFAULT 0 CHECK (years_experience >= 0),
  specializations text[] DEFAULT '{}',
  hourly_rate numeric DEFAULT 75.0 CHECK (hourly_rate > 0),
  currency text DEFAULT 'EUR'::text,
  total_sessions integer DEFAULT 0,
  average_rating numeric DEFAULT 0 CHECK (average_rating >= 0 AND average_rating <= 5),
  total_reviews integer DEFAULT 0,
  response_time_hours integer DEFAULT 24,
  instant_booking boolean DEFAULT false,
  languages text[] DEFAULT ARRAY['es'::text],
  coaching_methods text[] DEFAULT ARRAY['video'::text, 'phone'::text],
  verification_status text DEFAULT 'pending'::text CHECK (verification_status = ANY (ARRAY['pending'::text, 'verified'::text, 'rejected'::text])),
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT coach_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT coach_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(user_id)
);

-- 12. Crear tabla calendars
CREATE TABLE IF NOT EXISTS public.calendars (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  workspace_id bigint NOT NULL,
  name text NOT NULL DEFAULT 'Principal'::text,
  timezone text NOT NULL DEFAULT 'Europe/Madrid'::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT calendars_pkey PRIMARY KEY (id),
  CONSTRAINT calendars_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id)
);

-- 13. Insertar calendario por defecto
INSERT INTO public.calendars (workspace_id, name) 
SELECT 1, 'Principal' 
WHERE NOT EXISTS (SELECT 1 FROM public.calendars);

-- 14. Crear tabla sessions
CREATE TABLE IF NOT EXISTS public.sessions (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  workspace_id bigint NOT NULL DEFAULT 1,
  calendar_id bigint NOT NULL DEFAULT 1,
  type session_type_enum NOT NULL DEFAULT 'S1',
  status session_status_enum NOT NULL DEFAULT 'scheduled',
  starts_at timestamp with time zone NOT NULL,
  ends_at timestamp with time zone NOT NULL,
  price_eur numeric DEFAULT 0,
  notes text,
  created_by uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  title text,
  description text,
  session_type text DEFAULT 'video' CHECK (session_type = ANY (ARRAY['video'::text, 'phone'::text, 'chat'::text, 'in-person'::text])),
  meeting_link text,
  location text,
  client_notes text,
  coach_notes text,
  cancelled_at timestamp with time zone,
  cancellation_reason text,
  coach_profile_id bigint,
  client_profile_id uuid,
  CONSTRAINT sessions_pkey PRIMARY KEY (id),
  CONSTRAINT sessions_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id),
  CONSTRAINT sessions_calendar_id_fkey FOREIGN KEY (calendar_id) REFERENCES public.calendars(id),
  CONSTRAINT sessions_coach_profile_id_fkey FOREIGN KEY (coach_profile_id) REFERENCES public.coach_profiles(id),
  CONSTRAINT sessions_client_profile_id_fkey FOREIGN KEY (client_profile_id) REFERENCES public.profiles(user_id)
);

-- 15. Habilitar RLS en las nuevas tablas
ALTER TABLE public.coach_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendars ENABLE ROW LEVEL SECURITY;

-- 16. Crear políticas RLS
CREATE POLICY "Users can view their own coach profile" ON public.coach_profiles 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own coach profile" ON public.coach_profiles 
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own coach profile" ON public.coach_profiles 
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view sessions they participate in" ON public.sessions 
FOR SELECT USING (
  auth.uid() = created_by OR 
  auth.uid() = client_profile_id OR 
  EXISTS (SELECT 1 FROM coach_profiles WHERE id = coach_profile_id AND user_id = auth.uid())
);

CREATE POLICY "Coaches can create sessions" ON public.sessions 
FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM coach_profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Users can view workspaces" ON public.workspaces FOR SELECT USING (true);
CREATE POLICY "Users can view calendars" ON public.calendars FOR SELECT USING (true);