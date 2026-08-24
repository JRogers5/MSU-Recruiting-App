-- Run this once in Supabase: Project → SQL Editor → New query → paste → Run.
-- Requires schema.sql to have been run first (uses public.current_staff_role()).
-- Powers the 2027 Recruiting, 2028 Recruiting, and Transfer Recruiting boards
-- (distinguished by the `board` column) with the same card-based UI as the roster.

create table public.prospects (
  id uuid primary key default gen_random_uuid(),
  board text not null check (board in ('rec2027', 'rec2028', 'transfer')),
  name text not null,
  position_group text not null,
  high_school text,
  hometown text,
  height text,
  weight integer,
  notes text,
  photo_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.prospects enable row level security;

create policy "any staff can read prospects"
  on public.prospects for select
  using (public.current_staff_role() is not null);

create policy "only admins write prospects"
  on public.prospects for all
  using (public.current_staff_role() = 'admin')
  with check (public.current_staff_role() = 'admin');

insert into storage.buckets (id, name, public)
values ('prospect-photos', 'prospect-photos', true);

create policy "anyone can view prospect photos"
  on storage.objects for select
  using (bucket_id = 'prospect-photos');

create policy "only admins upload prospect photos"
  on storage.objects for insert
  with check (bucket_id = 'prospect-photos' and public.current_staff_role() = 'admin');

create policy "only admins update prospect photos"
  on storage.objects for update
  using (bucket_id = 'prospect-photos' and public.current_staff_role() = 'admin');

create policy "only admins delete prospect photos"
  on storage.objects for delete
  using (bucket_id = 'prospect-photos' and public.current_staff_role() = 'admin');
