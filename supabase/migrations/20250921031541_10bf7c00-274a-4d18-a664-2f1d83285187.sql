-- MIGRACIÓN PASO 1: Actualizar estructura completa de la base de datos (CORREGIDA)
-- Este migration transforma la estructura actual a la nueva arquitectura con workspaces y leads

-- 1. Crear tipos ENUM necesarios (con verificación manual)
DO $$ BEGIN
    CREATE TYPE activity_type_enum AS ENUM ('call', 'email', 'meeting', 'note', 'task');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE lead_stage_enum AS ENUM ('S1 reservado', 'S1 realizado', 'S2 vendido', 'S2 realizado', 'cerrado ganado', 'cerrado perdido');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE priority_enum AS ENUM ('baja', 'media', 'alta', 'urgente');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE lead_channel_enum AS ENUM ('web', 'phone', 'email', 'social', 'referral', 'organic');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

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

-- 4. Crear workspace por defecto si no existe
INSERT INTO public.workspaces (name) 
SELECT 'Workspace Principal' 
WHERE NOT EXISTS (SELECT 1 FROM public.workspaces LIMIT 1);

-- 5. Asignar usuarios existentes al workspace por defecto
INSERT INTO public.members (workspace_id, user_id, role)
SELECT 1, p.user_id, 'owner'
FROM public.profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM public.members m WHERE m.user_id = p.user_id
);

-- 6. Actualizar tabla calendars para incluir workspace_id
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'calendars' AND column_name = 'workspace_id') THEN
        ALTER TABLE public.calendars ADD COLUMN workspace_id bigint NOT NULL DEFAULT 1;
    END IF;
END $$;

-- Agregar foreign key si no existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'calendars_workspace_id_fkey') THEN
        ALTER TABLE public.calendars 
        ADD CONSTRAINT calendars_workspace_id_fkey 
        FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id);
    END IF;
END $$;

-- 7. Crear tabla leads
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

-- 8. Crear tabla tags
CREATE TABLE IF NOT EXISTS public.tags (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  workspace_id bigint NOT NULL,
  name text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT tags_pkey PRIMARY KEY (id),
  CONSTRAINT tags_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id)
);

-- 9. Crear tabla lead_tags (relación muchos a muchos)
CREATE TABLE IF NOT EXISTS public.lead_tags (
  lead_id bigint NOT NULL,
  tag_id bigint NOT NULL,
  CONSTRAINT lead_tags_pkey PRIMARY KEY (lead_id, tag_id),
  CONSTRAINT lead_tags_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.leads(id),
  CONSTRAINT lead_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id)
);

-- 10. Crear tabla activities
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

-- Confirmar migración paso 1 completada
SELECT 'Migración paso 1 completada exitosamente' as status;