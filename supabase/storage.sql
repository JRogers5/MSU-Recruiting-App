-- Run this once in Supabase: Project → SQL Editor → New query → paste → Run.
-- Requires schema.sql to have been run first (uses public.current_staff_role()).

insert into storage.buckets (id, name, public)
values ('player-photos', 'player-photos', true);

create policy "anyone can view player photos"
  on storage.objects for select
  using (bucket_id = 'player-photos');

create policy "only admins upload player photos"
  on storage.objects for insert
  with check (bucket_id = 'player-photos' and public.current_staff_role() = 'admin');

create policy "only admins update player photos"
  on storage.objects for update
  using (bucket_id = 'player-photos' and public.current_staff_role() = 'admin');

create policy "only admins delete player photos"
  on storage.objects for delete
  using (bucket_id = 'player-photos' and public.current_staff_role() = 'admin');
