-- Drop problematic views that may be causing issues
drop view if exists public.lib_screen_json cascade;
drop view if exists public.sessions_compat cascade;