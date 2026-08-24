-- Run this once in Supabase: Project → SQL Editor → New query → paste → Run.
-- Adds every field needed to auto-fill the recruit one-sheeter.

alter table public.prospects
  add column wingspan text,
  add column standing_reach text,
  add column dominant_hand text,
  add column player_cell text,
  add column twitter_handle text,
  add column instagram_handle text,
  add column hs_coach text,
  add column aau_coach text,
  add column agent text,
  add column offers text,
  add column ov_date text,
  add column main_competition text,
  add column main_recruiter text,
  add column sec_comp text,
  add column game_breakdown text,
  add column ppg text,
  add column rpg text,
  add column apg text,
  add column bpg text,
  add column fg_pct text,
  add column ft_pct text,
  add column three_pt_pct text,
  add column shot_chart_url text;
