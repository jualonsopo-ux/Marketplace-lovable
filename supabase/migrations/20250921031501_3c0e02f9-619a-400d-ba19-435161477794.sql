-- MIGRACIÓN PASO 1: Actualizar estructura completa de la base de datos
-- Este migration transforma la estructura actual a la nueva arquitectura con workspaces y leads

-- 1. Crear tipos ENUM necesarios
CREATE TYPE IF NOT EXISTS activity_type_enum AS ENUM ('call', 'email', 'meeting', 'note', 'task');
CREATE TYPE IF NOT EXISTS lead_stage_enum AS ENUM ('S1 reservado', 'S1 realizado', 'S2 vendido', 'S2 realizado', 'cerrado ganado', 'cerrado perdido');
CREATE TYPE IF NOT EXISTS priority_enum AS ENUM ('baja', 'media', 'alta', 'urgente');
CREATE TYPE IF NOT EXISTS lead_channel_enum AS ENUM ('web', 'phone', 'email', 'social', 'referral', 'organic');

-- 2. Crear tabla workspaces (base para multi-tenancy)
CREATE TABLE IF NOT EXISTS public.workspaces (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT workspaces_pkey PRIMARY KEY (id)
);

-- 3. Crear tabla members (relación usuarios-workspaces)
CREATE TABLE IF NOT EXISTS public.members (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  workspace_id bigint NOT NULL,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'owner'::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT members_pkey PRIMARY KEY (id),
  CONSTRAINT members_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id)
);

-- 4. Crear workspace y membresía por defecto para usuarios existentes
INSERT INTO public.workspaces (name) 
SELECT 'Workspace Principal' 
WHERE NOT EXISTS (SELECT 1 FROM public.workspaces LIMIT 1);

-- Asignar todos los usuarios existentes al workspace por defecto
INSERT INTO public.members (workspace_id, user_id, role)
SELECT 1, p.user_id, 'owner'
FROM public.profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM public.members m WHERE m.user_id = p.user_id
);

-- 5. Actualizar tabla calendars para incluir workspace_id
ALTER TABLE public.calendars 
ADD COLUMN IF NOT EXISTS workspace_id bigint NOT NULL DEFAULT 1;

ALTER TABLE public.calendars 
ADD CONSTRAINT IF NOT EXISTS calendars_workspace_id_fkey 
FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id);

-- 6. Crear tabla leads
CREATE TABLE IF NOT EXISTS public.leads (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  workspace_id bigint NOT NULL,
  owner_id uuid NOT NULL,
  full_name text NOT NULL,
  email text,
  phone text,
  channel lead_channel_enum,
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

-- 7. Crear tabla tags
CREATE TABLE IF NOT EXISTS public.tags (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  workspace_id bigint NOT NULL,
  name text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT tags_pkey PRIMARY KEY (id),
  CONSTRAINT tags_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id)
);

-- 8. Crear tabla lead_tags (relación muchos a muchos)
CREATE TABLE IF NOT EXISTS public.lead_tags (
  lead_id bigint NOT NULL,
  tag_id bigint NOT NULL,
  CONSTRAINT lead_tags_pkey PRIMARY KEY (lead_id, tag_id),
  CONSTRAINT lead_tags_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.leads(id),
  CONSTRAINT lead_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id)
);

-- 9. Crear tabla activities
CREATE TABLE IF NOT EXISTS public.activities (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  workspace_id bigint NOT NULL,
  lead_id bigint NOT NULL,
  type activity_type_enum NOT NULL,
  scheduled_at timestamp with time zone,
  done_at timestamp with time zone,
  amount numeric,
  notes text,
  created_by uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT activities_pkey PRIMARY KEY (id),
  CONSTRAINT activities_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id),
  CONSTRAINT activities_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.leads(id)
);

-- 10. Crear tablas de disponibilidad
CREATE TABLE IF NOT EXISTS public.availability_rules (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  workspace_id bigint NOT NULL,
  calendar_id bigint NOT NULL,
  weekday integer NOT NULL CHECK (weekday >= 0 AND weekday <= 6),
  start_time time without time zone NOT NULL,
  end_time time without time zone NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT availability_rules_pkey PRIMARY KEY (id),
  CONSTRAINT availability_rules_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id),
  CONSTRAINT availability_rules_calendar_id_fkey FOREIGN KEY (calendar_id) REFERENCES public.calendars(id)
);

CREATE TABLE IF NOT EXISTS public.availability_exceptions (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  workspace_id bigint NOT NULL,
  calendar_id bigint NOT NULL,
  date date NOT NULL,
  start_time time without time zone NOT NULL,
  end_time time without time zone NOT NULL,
  is_open boolean NOT NULL DEFAULT true,
  note text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT availability_exceptions_pkey PRIMARY KEY (id),
  CONSTRAINT availability_exceptions_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id),
  CONSTRAINT availability_exceptions_calendar_id_fkey FOREIGN KEY (calendar_id) REFERENCES public.calendars(id)
);

-- 11. Crear tabla session_reminders
CREATE TABLE IF NOT EXISTS public.session_reminders (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  workspace_id bigint NOT NULL,
  session_id uuid NOT NULL,
  method text NOT NULL DEFAULT 'email'::text,
  send_at timestamp with time zone NOT NULL,
  sent_at timestamp with time zone,
  status text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT session_reminders_pkey PRIMARY KEY (id),
  CONSTRAINT session_reminders_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id),
  CONSTRAINT session_reminders_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.sessions(id)
);

-- 12. Actualizar tabla sessions para incluir workspace_id y lead_id
ALTER TABLE public.sessions 
ADD COLUMN IF NOT EXISTS workspace_id bigint NOT NULL DEFAULT 1,
ADD COLUMN IF NOT EXISTS lead_id bigint,
ADD CONSTRAINT IF NOT EXISTS sessions_workspace_id_fkey 
FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id),
ADD CONSTRAINT IF NOT EXISTS sessions_lead_id_fkey 
FOREIGN KEY (lead_id) REFERENCES public.leads(id);

-- 13. Crear tabla activity_logs para auditoría
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid,
  action text NOT NULL,
  details jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT activity_logs_pkey PRIMARY KEY (id),
  CONSTRAINT activity_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- 14. Habilitar RLS en las nuevas tablas
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_exceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- 15. Crear políticas RLS básicas
-- Workspaces: usuarios pueden ver sus workspaces
CREATE POLICY IF NOT EXISTS "Users can view their workspaces"
ON public.workspaces FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.members m 
    WHERE m.workspace_id = workspaces.id 
    AND m.user_id = auth.uid()
  )
);

-- Members: usuarios pueden ver membresías de sus workspaces
CREATE POLICY IF NOT EXISTS "Users can view workspace members"
ON public.members FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.members m2 
    WHERE m2.workspace_id = members.workspace_id 
    AND m2.user_id = auth.uid()
  )
);

-- Leads: usuarios pueden gestionar leads de sus workspaces
CREATE POLICY IF NOT EXISTS "Users can manage leads in their workspaces"
ON public.leads FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.members m 
    WHERE m.workspace_id = leads.workspace_id 
    AND m.user_id = auth.uid()
  )
);

-- Activities: usuarios pueden gestionar actividades de sus workspaces
CREATE POLICY IF NOT EXISTS "Users can manage activities in their workspaces"
ON public.activities FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.members m 
    WHERE m.workspace_id = activities.workspace_id 
    AND m.user_id = auth.uid()
  )
);

-- 16. Crear trigger para updated_at en nuevas tablas
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER  
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Aplicar triggers a tablas que necesitan updated_at
DROP TRIGGER IF EXISTS update_leads_updated_at ON public.leads;
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_activities_updated_at ON public.activities;
CREATE TRIGGER update_activities_updated_at
  BEFORE UPDATE ON public.activities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_availability_rules_updated_at ON public.availability_rules;
CREATE TRIGGER update_availability_rules_updated_at
  BEFORE UPDATE ON public.availability_rules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_availability_exceptions_updated_at ON public.availability_exceptions;
CREATE TRIGGER update_availability_exceptions_updated_at
  BEFORE UPDATE ON public.availability_exceptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Confirmar migración exitosa
INSERT INTO public.activity_logs (action, details) 
VALUES ('database_migration', '{"step": 1, "description": "Complete schema migration with workspaces and leads support"}');