-- Run this once in Supabase: Project → SQL Editor → New query → paste → Run.

-- ── staff ────────────────────────────────────────────────────────────────
-- One row per person with a login. `id` is the Supabase Auth user id, so a
-- row only exists once someone has actually signed up / been invited.
create table public.staff (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  email text not null,
  role text not null check (role in ('admin', 'view_only')),
  invited_at timestamptz not null default now()
);

alter table public.staff enable row level security;

-- Looks up the caller's role. security definer so it can read the staff
-- table without re-triggering staff's own RLS policies (which would recurse).
create or replace function public.current_staff_role()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select role from public.staff where id = auth.uid();
$$;

create policy "staff can view own row, admins view all"
  on public.staff for select
  using (auth.uid() = id or public.current_staff_role() = 'admin');

create policy "only admins manage staff"
  on public.staff for all
  using (public.current_staff_role() = 'admin')
  with check (public.current_staff_role() = 'admin');

-- ── players ──────────────────────────────────────────────────────────────
create table public.players (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position text not null,
  class text,
  elig_remaining integer,
  height text,
  weight integer,
  hometown text,
  prior_school text,
  exempt boolean not null default false,
  photo_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.players enable row level security;

-- Any logged-in staff member (admin or view-only) can read the roster.
create policy "any staff can read players"
  on public.players for select
  using (public.current_staff_role() is not null);

-- Only admins can add/edit/delete/reorder players.
create policy "only admins write players"
  on public.players for all
  using (public.current_staff_role() = 'admin')
  with check (public.current_staff_role() = 'admin');
