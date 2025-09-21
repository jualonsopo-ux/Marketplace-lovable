-- Migración a esquema CRM completo
-- Primero crear los tipos enumerados necesarios

DO $$ BEGIN
    CREATE TYPE activity_type_enum AS ENUM ('call', 'email', 'meeting', 'note', 'task', 'follow_up');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE channel_enum AS ENUM ('website', 'phone', 'email', 'social', 'referral', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE lead_stage_enum AS ENUM ('S1 reservado', 'S2 pagado', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost', 'nurturing');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE priority_enum AS ENUM ('baja', 'media', 'alta', 'urgente');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

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

DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM ('client', 'coach', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Crear tabla workspaces
CREATE TABLE IF NOT EXISTS public.workspaces (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT workspaces_pkey PRIMARY KEY (id)
);

-- Insertar workspace por defecto
INSERT INTO public.workspaces (name) VALUES ('Default Workspace') ON CONFLICT DO NOTHING;

-- Actualizar tabla profiles para usar user_id en lugar de auth_user_id
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'auth_user_id') THEN
        ALTER TABLE public.profiles RENAME COLUMN auth_user_id TO user_id;
    END IF;
END $$;

-- Actualizar tabla profiles para cambiar role enum
ALTER TABLE public.profiles ALTER COLUMN role TYPE user_role_enum USING role::text::user_role_enum;

-- Crear tabla calendars
CREATE TABLE IF NOT EXISTS public.calendars (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  workspace_id bigint NOT NULL,
  name text NOT NULL DEFAULT 'Principal'::text,
  timezone text NOT NULL DEFAULT 'Europe/Madrid'::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT calendars_pkey PRIMARY KEY (id),
  CONSTRAINT calendars_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id)
);

-- Insertar calendario por defecto
INSERT INTO public.calendars (workspace_id, name) VALUES (1, 'Principal') ON CONFLICT DO NOTHING;

-- Crear tabla leads
CREATE TABLE IF NOT EXISTS public.leads (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  workspace_id bigint NOT NULL,
  owner_id uuid NOT NULL,
  full_name text NOT NULL,
  email text,
  phone text,
  channel channel_enum,
  stage lead_stage_enum NOT NULL DEFAULT 'S1 reservado'::lead_stage_enum,
  score integer CHECK (score >= 0 AND score <= 100),
  amount numeric,
  priority priority_enum NOT NULL DEFAULT 'media'::priority_enum,
  next_step text,
  due_at timestamp with time zone,
  last_contact_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT leads_pkey PRIMARY KEY (id),
  CONSTRAINT leads_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id)
);

-- Crear tabla coach_profiles (reemplaza coaches)
CREATE TABLE IF NOT EXISTS public.coach_profiles (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid NOT NULL UNIQUE,
  title text NOT NULL,
  bio text NOT NULL,
  years_experience integer DEFAULT 0 CHECK (years_experience >= 0),
  specializations text[] DEFAULT '{}',
  hourly_rate numeric NOT NULL CHECK (hourly_rate > 0),
  currency text DEFAULT 'EUR'::text,
  total_sessions integer DEFAULT 0,
  average_rating numeric DEFAULT 0 CHECK (average_rating >= 0 AND average_rating <= 5),
  total_reviews integer DEFAULT 0,
  response_time_hours integer DEFAULT 24,
  instant_booking boolean DEFAULT false,
  languages text[] DEFAULT ARRAY['es'::text],
  coaching_methods text[] CHECK (array_length(coaching_methods, 1) > 0),
  verification_status text DEFAULT 'pending'::text CHECK (verification_status = ANY (ARRAY['pending'::text, 'verified'::text, 'rejected'::text])),
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT coach_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT coach_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(user_id)
);

-- Migrar datos de coaches a coach_profiles si existe
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'coaches') THEN
        INSERT INTO public.coach_profiles (
            user_id, title, bio, specializations, languages, is_active
        )
        SELECT 
            profile_id as user_id,
            COALESCE(display_name, 'Coach') as title,
            COALESCE(bio, 'Descripción del coach') as bio,
            COALESCE(specialties, '{}') as specializations,
            COALESCE(languages, '{"es"}') as languages,
            COALESCE(is_published, true) as is_active
        FROM public.coaches
        WHERE profile_id IS NOT NULL
        ON CONFLICT (user_id) DO NOTHING;
    END IF;
END $$;

-- Crear tabla sessions (reemplaza bookings)
CREATE TABLE IF NOT EXISTS public.sessions (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  workspace_id bigint NOT NULL DEFAULT 1,
  calendar_id bigint NOT NULL DEFAULT 1,
  lead_id bigint,
  type session_type_enum NOT NULL,
  status session_status_enum NOT NULL DEFAULT 'scheduled'::session_status_enum,
  starts_at timestamp with time zone NOT NULL,
  ends_at timestamp with time zone NOT NULL,
  price_eur numeric,
  notes text,
  created_by uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  title text,
  description text,
  session_type text CHECK (session_type = ANY (ARRAY['video'::text, 'phone'::text, 'chat'::text, 'in-person'::text])),
  meeting_link text,
  meeting_id text,
  location text,
  client_notes text,
  coach_notes text,
  session_recording text,
  cancelled_at timestamp with time zone,
  cancellation_reason text,
  coach_profile_id bigint,
  client_profile_id uuid,
  CONSTRAINT sessions_pkey PRIMARY KEY (id),
  CONSTRAINT sessions_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id),
  CONSTRAINT sessions_calendar_id_fkey FOREIGN KEY (calendar_id) REFERENCES public.calendars(id),
  CONSTRAINT sessions_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.leads(id),
  CONSTRAINT sessions_coach_profile_id_fkey FOREIGN KEY (coach_profile_id) REFERENCES public.coach_profiles(id),
  CONSTRAINT sessions_client_profile_id_fkey FOREIGN KEY (client_profile_id) REFERENCES public.profiles(user_id)
);

-- Migrar datos de bookings a sessions si existe
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'bookings') THEN
        INSERT INTO public.sessions (
            workspace_id, calendar_id, type, status, starts_at, ends_at, 
            created_by, title, client_profile_id
        )
        SELECT 
            1 as workspace_id,
            1 as calendar_id,
            'S1'::session_type_enum as type,
            CASE 
                WHEN status = 'completed' THEN 'completed'::session_status_enum
                WHEN status = 'cancelled' THEN 'cancelled'::session_status_enum
                ELSE 'scheduled'::session_status_enum
            END as status,
            COALESCE(scheduled_at, created_at) as starts_at,
            COALESCE(scheduled_at, created_at) + interval '1 hour' as ends_at,
            coach_id as created_by,
            COALESCE(name, 'Sesión de coaching') as title,
            coach_id as client_profile_id -- Temporal, se debería ajustar
        FROM public.bookings
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Crear tabla reviews
CREATE TABLE IF NOT EXISTS public.reviews (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  session_id bigint NOT NULL UNIQUE,
  client_id uuid NOT NULL,
  coach_id bigint NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  tags text[] DEFAULT '{}',
  is_public boolean DEFAULT true,
  is_verified boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT reviews_pkey PRIMARY KEY (id),
  CONSTRAINT reviews_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.profiles(user_id),
  CONSTRAINT reviews_coach_id_fkey FOREIGN KEY (coach_id) REFERENCES public.coach_profiles(id),
  CONSTRAINT reviews_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.sessions(id)
);

-- Crear tabla members
CREATE TABLE IF NOT EXISTS public.members (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  workspace_id bigint NOT NULL,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'owner'::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT members_pkey PRIMARY KEY (id),
  CONSTRAINT members_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id)
);

-- Habilitar RLS en todas las tablas
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- Políticas RLS básicas
CREATE POLICY "Users can view their own coach profile" ON public.coach_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own coach profile" ON public.coach_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own coach profile" ON public.coach_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view sessions they're involved in" ON public.sessions FOR SELECT USING (
  auth.uid() = created_by OR 
  auth.uid() = client_profile_id OR 
  EXISTS (SELECT 1 FROM coach_profiles WHERE id = coach_profile_id AND user_id = auth.uid())
);

CREATE POLICY "Users can view reviews for their sessions" ON public.reviews FOR SELECT USING (
  auth.uid() = client_id OR 
  EXISTS (SELECT 1 FROM coach_profiles WHERE id = coach_id AND user_id = auth.uid())
);

-- Limpiar tablas antiguas si existen
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.coaches CASCADE;