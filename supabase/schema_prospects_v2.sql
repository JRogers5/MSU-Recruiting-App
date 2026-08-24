-- Run this once in Supabase: Project → SQL Editor → New query → paste → Run.
-- Adds AAU Team and replaces the free-text Notes field with two film links.

alter table public.prospects
  add column aau_team text,
  add column synergy_link text,
  add column highlight_link text,
  drop column notes;
