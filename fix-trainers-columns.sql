-- Run this once in the Supabase SQL Editor to enable the trainer image
-- Fit + Position controls. Safe to run more than once.
alter table public.trainers add column if not exists image_fit text default 'cover';
alter table public.trainers add column if not exists image_position text default 'center';
