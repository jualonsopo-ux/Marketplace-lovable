-- CoachWave Platform Schema Migration
-- This migration creates the complete coaching platform schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create coach_profiles table
CREATE TABLE IF NOT EXISTS public.coach_profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  title text NOT NULL,
  bio text NOT NULL,
  years_experience integer CHECK (years_experience >= 0) DEFAULT 0,
  specializations text[] DEFAULT '{}',
  hourly_rate decimal(10,2) CHECK (hourly_rate > 0) NOT NULL,
  currency text DEFAULT 'EUR',
  total_sessions integer DEFAULT 0,
  average_rating decimal(3,2) CHECK (average_rating >= 0 AND average_rating <= 5) DEFAULT 0,
  total_reviews integer DEFAULT 0,
  response_time_hours integer DEFAULT 24,
  instant_booking boolean DEFAULT false,
  languages text[] DEFAULT array['es'],
  coaching_methods text[] CHECK (array_length(coaching_methods, 1) > 0),
  verification_status text CHECK (verification_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add columns to existing sessions table to match the schema
ALTER TABLE public.sessions 
ADD COLUMN IF NOT EXISTS title text,
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS session_type text CHECK (session_type IN ('video', 'phone', 'chat', 'in-person')),
ADD COLUMN IF NOT EXISTS meeting_link text,
ADD COLUMN IF NOT EXISTS meeting_id text,
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS client_notes text,
ADD COLUMN IF NOT EXISTS coach_notes text,
ADD COLUMN IF NOT EXISTS session_recording text,
ADD COLUMN IF NOT EXISTS cancelled_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS cancellation_reason text;

-- Create coach_id column that references coach_profiles
ALTER TABLE public.sessions 
ADD COLUMN IF NOT EXISTS coach_profile_id uuid REFERENCES public.coach_profiles(id) ON DELETE CASCADE;

-- Create client_id column that references profiles
ALTER TABLE public.sessions 
ADD COLUMN IF NOT EXISTS client_profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id uuid REFERENCES public.sessions(id) ON DELETE CASCADE UNIQUE NOT NULL,
  client_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  coach_id uuid REFERENCES public.coach_profiles(id) ON DELETE CASCADE NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment text,
  tags text[] DEFAULT '{}',
  is_public boolean DEFAULT true,
  is_verified boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  icon text,
  color text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  meta_title text,
  meta_description text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create availability_schedules table
CREATE TABLE IF NOT EXISTS public.availability_schedules (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id uuid REFERENCES public.coach_profiles(id) ON DELETE CASCADE NOT NULL,
  day_of_week integer CHECK (day_of_week >= 0 AND day_of_week <= 6) NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT valid_availability_times CHECK (end_time > start_time)
);

-- Enable Row Level Security on new tables
ALTER TABLE public.coach_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for coach_profiles
CREATE POLICY "Public coach profiles viewable by everyone" ON public.coach_profiles
  FOR SELECT USING (is_active = true AND verification_status = 'verified');

CREATE POLICY "Coaches can view own profile" ON public.coach_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Coaches can insert own profile" ON public.coach_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Coaches can update own profile" ON public.coach_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS Policies for reviews
CREATE POLICY "Public reviews viewable by everyone" ON public.reviews
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view own reviews" ON public.reviews
  FOR SELECT USING (
    auth.uid() = client_id OR 
    auth.uid() = (SELECT user_id FROM public.coach_profiles WHERE id = coach_id)
  );

CREATE POLICY "Clients can create reviews for own sessions" ON public.reviews
  FOR INSERT WITH CHECK (
    auth.uid() = client_id AND 
    EXISTS (
      SELECT 1 FROM public.sessions 
      WHERE id = session_id AND client_profile_id = auth.uid() AND status = 'completed'
    )
  );

-- Create RLS Policies for categories (public read)
CREATE POLICY "Categories are viewable by everyone" ON public.categories
  FOR SELECT USING (is_active = true);

-- Create RLS Policies for availability_schedules
CREATE POLICY "Public schedules viewable by everyone" ON public.availability_schedules
  FOR SELECT USING (is_active = true);

CREATE POLICY "Coaches can manage own schedules" ON public.availability_schedules
  FOR ALL USING (
    auth.uid() = (SELECT user_id FROM public.coach_profiles WHERE id = coach_id)
  );

-- Create triggers for updated_at on new tables
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.coach_profiles
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Insert sample categories
INSERT INTO public.categories (name, slug, description, icon, color) VALUES
  ('Coaching Personal', 'coaching-personal', 'Desarrollo personal y autoconocimiento', 'User', '#3B82F6'),
  ('Coaching Ejecutivo', 'coaching-ejecutivo', 'Liderazgo y gestión empresarial', 'Briefcase', '#8B5CF6'),
  ('Coaching de Vida', 'coaching-vida', 'Balance vida-trabajo y bienestar', 'Heart', '#EF4444'),
  ('Coaching Profesional', 'coaching-profesional', 'Desarrollo de carrera profesional', 'TrendingUp', '#10B981'),
  ('Coaching Deportivo', 'coaching-deportivo', 'Rendimiento y mentalidad deportiva', 'Zap', '#F59E0B')
ON CONFLICT (slug) DO NOTHING;