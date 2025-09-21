-- Create required PostgreSQL extensions
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- Core application enums
do $$ begin create type public.user_role_enum as enum ('client','coach','admin','staff'); exception when duplicate_object then null; end $$;
do $$ begin create type public.offering_type as enum ('S1','S2','S3','package');        exception when duplicate_object then null; end $$;
do $$ begin create type public.currency as enum ('EUR','USD','GBP');                    exception when duplicate_object then null; end $$;
do $$ begin create type public.booking_status as enum ('pending','confirmed','canceled','no_show','completed'); exception when duplicate_object then null; end $$;
do $$ begin create type public.webview_type as enum ('instagram','tiktok','other');     exception when duplicate_object then null; end $$;

-- CRM enums used in your second schema
do $$ begin create type public.lead_stage_enum as enum ('nuevo','cualificado','S1 reservado','S1 realizada','en negociación','ganado','perdido'); exception when duplicate_object then null; end $$;
do $$ begin create type public.priority_enum   as enum ('alta','media','baja');                                  exception when duplicate_object then null; end $$;
do $$ begin create type public.channel_enum    as enum ('instagram','tiktok','lib','seo','referral','ads','otros'); exception when duplicate_object then null; end $$;

-- Session-style compatibility enums
do $$ begin create type public.session_status_enum as enum ('scheduled','completed','canceled','no_show','rescheduled'); exception when duplicate_object then null; end $$;
do $$ begin create type public.session_type_enum   as enum ('S1','S2','S3','package');                                  exception when duplicate_object then null; end $$;