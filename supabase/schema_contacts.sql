-- Run this once in Supabase: Project → SQL Editor → New query → paste → Run.
-- Requires schema.sql to have been run first (uses public.current_staff_role()).

create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  organization text,
  phone text,
  created_at timestamptz not null default now()
);

alter table public.contacts enable row level security;

create policy "any staff can read contacts"
  on public.contacts for select
  using (public.current_staff_role() is not null);

create policy "only admins write contacts"
  on public.contacts for all
  using (public.current_staff_role() = 'admin')
  with check (public.current_staff_role() = 'admin');
