-- Run this once in Supabase: Project → SQL Editor → New query → paste → Run.
-- Requires schema.sql to have been run first (uses public.current_staff_role()).

create table public.settings (
  id boolean primary key default true,
  constraint settings_singleton check (id),
  team_name text not null default 'Mississippi State Basketball',
  roster_limit integer not null default 15
);

insert into public.settings (id) values (true);

alter table public.settings enable row level security;

create policy "any staff can read settings"
  on public.settings for select
  using (public.current_staff_role() is not null);

create policy "only admins write settings"
  on public.settings for update
  using (public.current_staff_role() = 'admin')
  with check (public.current_staff_role() = 'admin');
