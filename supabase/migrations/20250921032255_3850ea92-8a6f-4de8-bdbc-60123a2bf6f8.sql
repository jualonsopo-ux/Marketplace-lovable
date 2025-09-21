-- =========================
-- A) ENUMS CONSOLIDADOS
-- =========================
do $$ begin create type public.user_role_enum as enum ('client','coach','admin','staff'); exception when duplicate_object then null; end $$;
do $$ begin create type public.offering_type as enum ('S1','S2','S3','package'); exception when duplicate_object then null; end $$;
do $$ begin create type public.currency as enum ('EUR','USD','GBP'); exception when duplicate_object then null; end $$;
do $$ begin create type public.booking_status as enum ('pending','confirmed','canceled','no_show','completed'); exception when duplicate_object then null; end $$;
do $$ begin create type public.webview_type as enum ('instagram','tiktok','other'); exception when duplicate_object then null; end $$;

-- CRM
do $$ begin create type public.lead_stage_enum as enum ('nuevo','cualificado','S1 reservado','S1 realizada','en negociación','ganado','perdido'); exception when duplicate_object then null; end $$;
do $$ begin create type public.priority_enum as enum ('alta','media','baja'); exception when duplicate_object then null; end $$;
do $$ begin create type public.channel_enum as enum ('instagram','tiktok','lib','seo','referral','ads','otros'); exception when duplicate_object then null; end $$;

-- Sesiones (compat con tu CRM)
do $$ begin create type public.session_status_enum as enum ('scheduled','completed','canceled','no_show','rescheduled'); exception when duplicate_object then null; end $$;
do $$ begin create type public.session_type_enum as enum ('S1','S2','S3','package'); exception when duplicate_object then null; end $$;

-- =========================
-- B) PROFILES (UNIFICAR)
-- =========================
-- Si tu tabla ya existe con otras columnas, solo añadimos las que falten.
alter table if exists public.profiles
  add column if not exists user_id uuid unique,
  add column if not exists full_name text,
  add column if not exists handle text unique,
  add column if not exists email text unique,
  add column if not exists role public.user_role_enum not null default 'client',
  add column if not exists is_active boolean not null default true,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

-- Backfill user_id desde posibles columnas anteriores
do $$
begin
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='profiles' and column_name='auth_user_id') then
    update public.profiles set user_id = coalesce(user_id, auth_user_id);
  end if;
end $$;

-- FK a auth.users
do $$ begin
  alter table public.profiles
    add constraint profiles_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;
exception when duplicate_object then null; end $$;

create index if not exists profiles_handle_idx on public.profiles (handle);

-- =========================
-- C) COACHES (OK) + STRIPE/CAL
-- =========================
-- Asegurar unicidad por profile
alter table public.coaches
  add column if not exists profile_id uuid,
  add column if not exists display_name text,
  add column if not exists is_published boolean not null default false;

-- FK a profiles si no existe
do $$ begin
  alter table public.coaches
    add constraint coaches_profile_id_fkey foreign key (profile_id) references public.profiles(id) on delete cascade;
exception when duplicate_object then null; end $$;

-- Calendario fuente (Cal.com por coach)
create table if not exists public.calendar_sources (
  id uuid primary key default uuid_generate_v4(),
  coach_id uuid not null references public.coaches(id) on delete cascade,
  provider text not null default 'cal.com',
  external_username text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- =========================
-- D) MARKETPLACE / CRM
-- =========================
create table if not exists public.workspaces (
  id bigserial primary key,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.members (
  id bigserial primary key,
  workspace_id bigint not null references public.workspaces(id) on delete cascade,
  user_id uuid not null, -- auth.users.id
  role text not null default 'owner',
  created_at timestamptz not null default now()
);

-- LEADS (bigint) enlazables a coach/oferta/booking
create table if not exists public.leads (
  id bigserial primary key,
  workspace_id bigint not null references public.workspaces(id) on delete cascade,
  owner_id uuid not null,                      -- profiles.user_id (auth.users.id)
  full_name text not null,
  email text,
  phone text,
  channel public.channel_enum,
  stage public.lead_stage_enum not null default 'nuevo',
  score int check (score between 0 and 100),
  amount numeric,
  priority public.priority_enum not null default 'media',
  next_step text,
  due_at timestamptz,
  last_contact_at timestamptz,
  coach_id uuid references public.coaches(id) on delete set null,
  offering_id uuid references public.offerings(id) on delete set null,
  booking_id uuid references public.bookings(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists leads_idx_ws on public.leads(workspace_id, stage);
create index if not exists leads_idx_coach on public.leads(coach_id);

create table if not exists public.tags (
  id bigserial primary key,
  workspace_id bigint not null references public.workspaces(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.lead_tags (
  lead_id bigint not null references public.leads(id) on delete cascade,
  tag_id  bigint not null references public.tags(id) on delete cascade,
  primary key (lead_id, tag_id)
);

create table if not exists public.activities (
  id bigserial primary key,
  workspace_id bigint not null references public.workspaces(id) on delete cascade,
  lead_id bigint not null references public.leads(id) on delete cascade,
  type text not null, -- libre: 'call','email','note','task','payment'
  scheduled_at timestamptz,
  done_at timestamptz,
  amount numeric,
  notes text,
  created_by uuid not null, -- auth.users.id
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Calendario de workspace (para tu CRM)
create table if not exists public.calendars (
  id bigserial primary key,
  workspace_id bigint not null references public.workspaces(id) on delete cascade,
  name text not null default 'Principal',
  timezone text not null default 'Europe/Madrid',
  created_at timestamptz not null default now()
);

create table if not exists public.availability_rules (
  id bigserial primary key,
  workspace_id bigint not null references public.workspaces(id) on delete cascade,
  calendar_id bigint not null references public.calendars(id) on delete cascade,
  weekday int not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.availability_exceptions (
  id bigserial primary key,
  workspace_id bigint not null references public.workspaces(id) on delete cascade,
  calendar_id bigint not null references public.calendars(id) on delete cascade,
  date date not null,
  start_time time not null,
  end_time time not null,
  is_open boolean not null default true,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================
-- E) BOOKING + "SESSION FIELDS"
-- =========================
-- Aseguramos columnas extra para cubrir tu antigua tabla sessions
alter table public.bookings
  add column if not exists client_profile_id uuid, -- opcional: perfila al cliente
  add column if not exists meeting_link text,
  add column if not exists meeting_id text,
  add column if not exists notes text,
  add column if not exists client_notes text,
  add column if not exists coach_notes text,
  add column if not exists canceled_at timestamptz,
  add column if not exists cancellation_reason text;

-- Índices útiles
create index if not exists bookings_idx_coach_time on public.bookings(coach_id, scheduled_at);
create index if not exists bookings_idx_email on public.bookings(email);

-- =========================
-- F) VISTA DE COMPATIBILIDAD (sessions)
-- =========================
-- Si existe una tabla sessions previa, NO la tocamos. Creamos una vista 'sessions_compat'
drop view if exists public.sessions_compat;
create view public.sessions_compat as
select
  b.id::uuid                         as id,
  -- Defaults/joins para compatibilidad
  coalesce(l.workspace_id, 1)::bigint as workspace_id,
  null::bigint                        as calendar_id,
  l.id                                as lead_id,
  (case o.type when 'S1' then 'S1' when 'S2' then 'S2' when 'S3' then 'S3' else 'package' end)::public.session_type_enum as type,
  (case b.status
      when 'pending'   then 'scheduled'
      when 'confirmed' then 'scheduled'
      when 'completed' then 'completed'
      when 'canceled'  then 'canceled'
      when 'no_show'   then 'no_show'
   end)::public.session_status_enum   as status,
  b.scheduled_at                      as starts_at,
  (b.scheduled_at + (o.duration_min||' minutes')::interval) as ends_at,
  (case when o.price is null then 0 else o.price end)        as price_eur,
  b.notes,
  b.created_at,
  b.updated_at,
  o.title                             as title,
  null::text                          as description,
  'video'::text                       as session_type,
  b.meeting_link,
  b.meeting_id,
  null::text                          as location,
  b.client_notes,
  b.coach_notes,
  null::text                          as session_recording,
  b.canceled_at                       as cancelled_at,
  b.cancellation_reason               as cancellation_reason,
  c.id                                as coach_id,           -- UUID del coach (antes coach_profile_id)
  b.client_profile_id                 as client_profile_id
from public.bookings b
left join public.offerings o on o.id = b.offering_id
left join public.coaches   c on c.id = b.coach_id
left join public.leads     l on l.booking_id = b.id;

-- =========================
-- G) LIB SCREEN JSON (asegurar que es VIEW, no tabla)
drop view if exists public.lib_screen_json;
-- Por compatibilidad: si alguien creó una tabla con ese nombre, la renombramos
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema='public' and table_name='lib_screen_json') then
    execute 'alter table public.lib_screen_json rename to lib_screen_json_tbl_backup';
  end if;
end $$;

-- Crea la vista desde los datos reales (usa la que ya te pasé; aquí simplificada)
create view public.lib_screen_json as
select
  p.handle,
  jsonb_build_object(
    'screen', jsonb_build_object(
      'id','link_in_bio',
      'route','/l/'||p.handle,
      'title', co.display_name || ' · Sesión de onboarding en 10''
    ),
    'dataSources', jsonb_build_object(
      'creator.offerings', jsonb_build_object(
        'items', (select coalesce(jsonb_agg(jsonb_build_object(
                  'id',o.id,'type',o.type,'title',o.title,'duration_min',o.duration_min,'price',o.price,'currency',o.currency,'badge',o.badge)
                order by o.position asc), '[]'::jsonb)
                from public.offerings o where o.coach_id=co.id and o.is_active)
      )
    )
  ) as app
from public.profiles p
join public.coaches co on co.profile_id = p.id
where co.is_published = true;

-- =========================
-- H) OTRAS TABLAS SOPORTE (si faltan)
-- =========================

-- RGPD
create table if not exists public.consents (
  id text primary key,
  legal_base text not null,     -- 'Art. 6.1.a' | 'Art. 6.1.b'
  scope text[] not null
);

create table if not exists public.consent_logs (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  consent_id text not null references public.consents(id),
  granted boolean not null default true,
  granted_at timestamptz not null default now()
);

-- Políticas coach
create table if not exists public.coach_policies (
  coach_id uuid primary key references public.coaches(id) on delete cascade,
  retention_s1_sin_s2 interval not null default interval '30 days',
  retention_facturacion interval not null default interval '7 years',
  quiet_from time not null default time '21:00',
  quiet_to time not null default time '08:00',
  quiet_timezone text not null default 'Europe/Madrid',
  created_at timestamptz not null default now()
);

-- Eventos analytics (sin cookies)
create table if not exists public.analytics_events (
  id uuid primary key default uuid_generate_v4(),
  coach_id uuid not null references public.coaches(id) on delete cascade,
  event_name text not null,
  attributes jsonb not null default '{}'::jsonb,
  webview public.webview_type default 'other',
  created_at timestamptz not null default now()
);

-- Webhooks externos
create table if not exists public.stripe_events (
  id text primary key,
  type text not null,
  data jsonb not null,
  received_at timestamptz not null default now(),
  processed boolean not null default false
);

create table if not exists public.calcom_events (
  id text primary key,
  type text not null,
  data jsonb not null,
  received_at timestamptz not null default now(),
  processed boolean not null default false
);