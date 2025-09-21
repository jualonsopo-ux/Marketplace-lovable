-- Add email_confirm boolean column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN email_confirm BOOLEAN DEFAULT true;