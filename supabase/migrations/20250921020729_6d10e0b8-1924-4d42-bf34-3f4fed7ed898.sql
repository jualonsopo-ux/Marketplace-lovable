-- Helper: id de profile actual por auth.uid()
create or replace function public.current_profile_id()
returns uuid language sql stable as $$
  select p.id from public.profiles p where p.auth_user_id = auth.uid();
$$;

-- Activa RLS en tablas visibles en tu captura
alter table public.coaches             enable row level security;
alter table public.reels               enable row level security;
alter table public.offerings           enable row level security;
alter table public.faq                 enable row level security;
alter table public.reviews             enable row level security;
alter table public.feature_flags       enable row level security;
alter table public.seo_pages           enable row level security;
alter table public.coach_policies      enable row level security;
alter table public.bookings            enable row level security;
alter table public.analytics_events    enable row level security;

-- (opcional) otras
alter table public.calendar_sources    enable row level security;
alter table public.consent_logs        enable row level security;
alter table public.consents            enable row level security;