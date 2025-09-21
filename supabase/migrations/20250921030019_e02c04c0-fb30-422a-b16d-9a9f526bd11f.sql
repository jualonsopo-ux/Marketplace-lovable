-- MIGRACIÓN SIMPLE: Convertir bigint IDs a UUID paso a paso
-- Esta es una aproximación más segura y directa

-- PASO 1: Manejar coach_profiles
-- Eliminar constraints que puedan interferir
ALTER TABLE sessions DROP CONSTRAINT IF EXISTS sessions_coach_profile_id_fkey;

-- Cambiar el tipo de ID en coach_profiles
-- Crear nueva tabla temporal con estructura UUID
CREATE TABLE coach_profiles_new (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    bio TEXT NOT NULL,
    years_experience INTEGER DEFAULT 0,
    hourly_rate NUMERIC DEFAULT 75.0,
    total_sessions INTEGER DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
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
    languages TEXT[] DEFAULT ARRAY['es'],
    specializations TEXT[] DEFAULT '{}'
);

-- Copiar datos existentes generando nuevos UUIDs
INSERT INTO coach_profiles_new (
    user_id, title, bio, years_experience, hourly_rate, 
    total_sessions, total_reviews, average_rating, 
    response_time_hours, instant_booking, is_featured, 
    is_active, created_at, updated_at, currency, 
    verification_status, coaching_methods, languages, specializations
)
SELECT 
    user_id, title, bio, years_experience, hourly_rate,
    total_sessions, total_reviews, average_rating,
    response_time_hours, instant_booking, is_featured,
    is_active, created_at, updated_at, currency,
    verification_status, coaching_methods, languages, specializations
FROM coach_profiles;

-- PASO 2: Crear mapeo de IDs viejos a nuevos
CREATE TABLE temp_coach_id_mapping AS
SELECT 
    row_number() OVER (ORDER BY old.created_at) as row_num,
    old.id as old_id,
    new.id as new_id
FROM coach_profiles old
JOIN (
    SELECT id, row_number() OVER (ORDER BY created_at) as row_num
    FROM coach_profiles_new
) new ON new.row_num = row_number() OVER (ORDER BY old.created_at);

-- PASO 3: Actualizar sessions para usar nuevos UUIDs
UPDATE sessions 
SET coach_profile_id = CAST(mapping.new_id AS BIGINT)
FROM temp_coach_id_mapping mapping
WHERE sessions.coach_profile_id = mapping.old_id;

-- PASO 4: Reemplazar tabla coach_profiles
DROP TABLE coach_profiles CASCADE;
ALTER TABLE coach_profiles_new RENAME TO coach_profiles;

-- PASO 5: Cambiar sessions.id de bigint a uuid
CREATE TABLE sessions_new (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    description TEXT,
    location TEXT,
    starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL DEFAULT 'scheduled',
    type TEXT NOT NULL DEFAULT 'S1',
    session_type TEXT DEFAULT 'video',
    meeting_link TEXT,
    notes TEXT,
    coach_notes TEXT,
    client_notes TEXT,
    cancellation_reason TEXT,
    client_profile_id UUID,
    coach_profile_id UUID,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by UUID NOT NULL,
    price_eur NUMERIC DEFAULT 0,
    calendar_id BIGINT NOT NULL DEFAULT 1,
    workspace_id BIGINT NOT NULL DEFAULT 1
);

-- Copiar datos de sessions
INSERT INTO sessions_new (
    title, description, location, starts_at, ends_at,
    status, type, session_type, meeting_link, notes,
    coach_notes, client_notes, cancellation_reason,
    client_profile_id, cancelled_at, created_at,
    updated_at, created_by, price_eur, calendar_id, workspace_id
)
SELECT 
    title, description, location, starts_at, ends_at,
    status::text, type::text, session_type, meeting_link, notes,
    coach_notes, client_notes, cancellation_reason,
    client_profile_id, cancelled_at, created_at,
    updated_at, created_by, price_eur, calendar_id, workspace_id
FROM sessions;

-- Mapear coach_profile_id correctamente
UPDATE sessions_new s
SET coach_profile_id = mapping.new_id
FROM temp_coach_id_mapping mapping
WHERE s.coach_profile_id IS NULL AND mapping.old_id IN (
    SELECT DISTINCT coach_profile_id FROM sessions WHERE coach_profile_id IS NOT NULL
);

-- PASO 6: Reemplazar sessions
DROP TABLE sessions CASCADE;
ALTER TABLE sessions_new RENAME TO sessions;

-- PASO 7: Limpiar
DROP TABLE temp_coach_id_mapping;