-- Run this once in Supabase: Project → SQL Editor → New query → paste → Run.

alter table public.prospects
  add column committed boolean not null default false;
