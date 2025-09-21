-- Create session management tables for coaching platform

-- Session types enum
CREATE TYPE session_type_enum AS ENUM ('video', 'phone', 'chat', 'in-person');

-- Session status enum  
CREATE TYPE session_status_enum AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');

-- Payment status enum
CREATE TYPE payment_status_enum AS ENUM ('pending', 'paid', 'refunded', 'failed');

-- Create sessions table
CREATE TABLE public.sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID NOT NULL, -- References user who is the coach
  client_id UUID NOT NULL, -- References user who is the client
  title TEXT NOT NULL,
  description TEXT,
  session_type session_type_enum NOT NULL DEFAULT 'video',
  location TEXT, -- For in-person sessions
  scheduled_start TIMESTAMP WITH TIME ZONE NOT NULL,
  scheduled_end TIMESTAMP WITH TIME ZONE NOT NULL,
  actual_start TIMESTAMP WITH TIME ZONE,
  actual_end TIMESTAMP WITH TIME ZONE,
  status session_status_enum NOT NULL DEFAULT 'scheduled',
  payment_status payment_status_enum NOT NULL DEFAULT 'pending',
  amount DECIMAL(10,2), -- Session price
  currency VARCHAR(3) DEFAULT 'EUR',
  meeting_url TEXT, -- Video call link
  phone_number TEXT, -- For phone sessions
  notes TEXT, -- Coach notes
  client_notes TEXT, -- Client notes
  cancellation_reason TEXT,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancelled_by UUID, -- Who cancelled the session
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reviews table for session feedback
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  client_id UUID NOT NULL,
  coach_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  tags TEXT[] DEFAULT '{}', -- Array of tags like 'helpful', 'professional', etc.
  is_public BOOLEAN NOT NULL DEFAULT true,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create coaches table for coach profiles
CREATE TABLE public.coaches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  title TEXT NOT NULL, -- Professional title
  bio TEXT NOT NULL,
  specialties TEXT[] NOT NULL DEFAULT '{}',
  languages TEXT[] NOT NULL DEFAULT '{"es"}',
  experience_years INTEGER DEFAULT 0,
  hourly_rate DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'EUR',
  availability_timezone TEXT DEFAULT 'Europe/Madrid',
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  verification_date TIMESTAMP WITH TIME ZONE,
  total_sessions INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0.00,
  total_reviews INTEGER DEFAULT 0,
  response_time_hours INTEGER DEFAULT 24,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaches ENABLE ROW LEVEL SECURITY;

-- Sessions RLS Policies
CREATE POLICY "Users can view their own sessions as client" 
ON public.sessions 
FOR SELECT 
USING (auth.uid() = client_id);

CREATE POLICY "Users can view their own sessions as coach" 
ON public.sessions 
FOR SELECT 
USING (auth.uid() = coach_id);

CREATE POLICY "Clients can create sessions" 
ON public.sessions 
FOR INSERT 
WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Users can update their own sessions as client" 
ON public.sessions 
FOR UPDATE 
USING (auth.uid() = client_id);

CREATE POLICY "Users can update their own sessions as coach" 
ON public.sessions 
FOR UPDATE 
USING (auth.uid() = coach_id);

-- Reviews RLS Policies
CREATE POLICY "Anyone can view public reviews" 
ON public.reviews 
FOR SELECT 
USING (is_public = true);

CREATE POLICY "Users can view their own reviews" 
ON public.reviews 
FOR SELECT 
USING (auth.uid() = client_id OR auth.uid() = coach_id);

CREATE POLICY "Clients can create reviews for their sessions" 
ON public.reviews 
FOR INSERT 
WITH CHECK (
  auth.uid() = client_id AND 
  EXISTS (
    SELECT 1 FROM public.sessions s 
    WHERE s.id = session_id 
    AND s.client_id = auth.uid() 
    AND s.status = 'completed'
  )
);

CREATE POLICY "Users can update their own reviews" 
ON public.reviews 
FOR UPDATE 
USING (auth.uid() = client_id);

-- Coaches RLS Policies
CREATE POLICY "Anyone can view active coaches" 
ON public.coaches 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Users can view their own coach profile" 
ON public.coaches 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own coach profile" 
ON public.coaches 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own coach profile" 
ON public.coaches 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_sessions_updated_at
BEFORE UPDATE ON public.sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_coaches_updated_at
BEFORE UPDATE ON public.coaches
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_sessions_client_id ON public.sessions(client_id);
CREATE INDEX idx_sessions_coach_id ON public.sessions(coach_id);
CREATE INDEX idx_sessions_scheduled_start ON public.sessions(scheduled_start);
CREATE INDEX idx_sessions_status ON public.sessions(status);
CREATE INDEX idx_reviews_session_id ON public.reviews(session_id);
CREATE INDEX idx_reviews_coach_id ON public.reviews(coach_id);
CREATE INDEX idx_coaches_user_id ON public.coaches(user_id);
CREATE INDEX idx_coaches_is_active ON public.coaches(is_active);

-- Insert sample coach data (for development)
INSERT INTO public.coaches (user_id, title, bio, specialties, languages, experience_years, hourly_rate, is_active, is_verified) 
SELECT 
  id,
  'Coach Profesional',
  'Coach especializado en desarrollo personal y profesional con más de 5 años de experiencia ayudando a personas a alcanzar sus objetivos.',
  ARRAY['Desarrollo personal', 'Liderazgo', 'Carrera profesional'],
  ARRAY['Español', 'Inglés'],
  5,
  65.00,
  true,
  true
FROM auth.users 
WHERE email = 'jualonsopo@gmail.com'
ON CONFLICT (user_id) DO NOTHING;