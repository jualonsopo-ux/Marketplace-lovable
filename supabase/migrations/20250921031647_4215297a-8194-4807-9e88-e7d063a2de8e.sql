-- MIGRACIÓN PASO 1B: Resolver problemas de seguridad críticos
-- Habilitar RLS y crear políticas para todas las tablas

-- 1. Habilitar RLS en tablas que faltan
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calcom_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_policies ENABLE ROW LEVEL SECURITY;

-- 2. Crear políticas RLS para nuevas tablas

-- Workspaces: usuarios pueden ver y gestionar sus workspaces
DROP POLICY IF EXISTS "Users can view their workspaces" ON public.workspaces;
CREATE POLICY "Users can view their workspaces"
ON public.workspaces FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.members m 
    WHERE m.workspace_id = workspaces.id 
    AND m.user_id = auth.uid()
  )
);

CREATE POLICY "Users can manage their workspaces"
ON public.workspaces FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.members m 
    WHERE m.workspace_id = workspaces.id 
    AND m.user_id = auth.uid()
    AND m.role = 'owner'
  )
);

-- Members: gestión de membresías
DROP POLICY IF EXISTS "Users can view workspace members" ON public.members;
CREATE POLICY "Users can view workspace members"
ON public.members FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.members m2 
    WHERE m2.workspace_id = members.workspace_id 
    AND m2.user_id = auth.uid()
  )
);

CREATE POLICY "Owners can manage workspace members"
ON public.members FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.members m2 
    WHERE m2.workspace_id = members.workspace_id 
    AND m2.user_id = auth.uid()
    AND m2.role = 'owner'
  )
);

-- Leads: gestión completa para miembros del workspace
DROP POLICY IF EXISTS "Users can manage leads in their workspaces" ON public.leads;
CREATE POLICY "Users can manage leads in their workspaces"
ON public.leads FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.members m 
    WHERE m.workspace_id = leads.workspace_id 
    AND m.user_id = auth.uid()
  )
);

-- Tags: gestión para miembros del workspace
CREATE POLICY "Users can manage tags in their workspaces"
ON public.tags FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.members m 
    WHERE m.workspace_id = tags.workspace_id 
    AND m.user_id = auth.uid()
  )
);

-- Lead_tags: gestión basada en acceso a leads
CREATE POLICY "Users can manage lead tags"
ON public.lead_tags FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.leads l
    JOIN public.members m ON m.workspace_id = l.workspace_id
    WHERE l.id = lead_tags.lead_id 
    AND m.user_id = auth.uid()
  )
);

-- Activities: gestión para miembros del workspace
DROP POLICY IF EXISTS "Users can manage activities in their workspaces" ON public.activities;
CREATE POLICY "Users can manage activities in their workspaces"
ON public.activities FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.members m 
    WHERE m.workspace_id = activities.workspace_id 
    AND m.user_id = auth.uid()
  )
);

-- Availability_rules: gestión para miembros del workspace
CREATE POLICY "Users can manage availability rules"
ON public.availability_rules FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.members m 
    WHERE m.workspace_id = availability_rules.workspace_id 
    AND m.user_id = auth.uid()
  )
);

-- Availability_exceptions: gestión para miembros del workspace
CREATE POLICY "Users can manage availability exceptions"
ON public.availability_exceptions FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.members m 
    WHERE m.workspace_id = availability_exceptions.workspace_id 
    AND m.user_id = auth.uid()
  )
);

-- Session_reminders: gestión para miembros del workspace
CREATE POLICY "Users can manage session reminders"
ON public.session_reminders FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.members m 
    WHERE m.workspace_id = session_reminders.workspace_id 
    AND m.user_id = auth.uid()
  )
);

-- Activity_logs: usuarios pueden ver solo sus propios logs
CREATE POLICY "Users can view their own activity logs"
ON public.activity_logs FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "System can insert activity logs"
ON public.activity_logs FOR INSERT
WITH CHECK (true);

-- 3. Crear políticas para tablas existentes sin RLS
-- Analytics_events: solo visible para el coach propietario
CREATE POLICY "Coaches can view their analytics"
ON public.analytics_events FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.coaches c
    JOIN public.profiles p ON c.profile_id = p.id
    WHERE c.id = analytics_events.coach_id 
    AND p.user_id = auth.uid()
  )
);

-- Calcom_events: acceso del sistema
CREATE POLICY "System can manage calcom events"
ON public.calcom_events FOR ALL
USING (true);

-- Calendar_sources: acceso para el coach propietario
CREATE POLICY "Coaches can manage their calendar sources"
ON public.calendar_sources FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.coaches c
    JOIN public.profiles p ON c.profile_id = p.id
    WHERE c.id = calendar_sources.coach_id 
    AND p.user_id = auth.uid()
  )
);

-- Coach_policies: acceso para el coach propietario
CREATE POLICY "Coaches can manage their policies"
ON public.coach_policies FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.coaches c
    JOIN public.profiles p ON c.profile_id = p.id
    WHERE c.id = coach_policies.coach_id 
    AND p.user_id = auth.uid()
  )
);

-- Confirmar políticas creadas
INSERT INTO public.activity_logs (action, details) 
VALUES ('security_policies_created', '{"step": "1b", "description": "RLS policies created for all tables"}');