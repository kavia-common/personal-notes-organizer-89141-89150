-- Recommended schema for the notes table + permissive RLS for development
-- Run this in your Supabase SQL editor if needed.

create extension if not exists pgcrypto;

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Keep updated_at in sync
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_set_updated_at on public.notes;
create trigger trg_set_updated_at
before update on public.notes
for each row execute function set_updated_at();

-- Enable Row Level Security
alter table public.notes enable row level security;

-- Permissive policies for development (do not use in production as-is)
do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='notes' and policyname='notes_select_all') then
    create policy "notes_select_all" on public.notes for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='notes' and policyname='notes_insert_all') then
    create policy "notes_insert_all" on public.notes for insert with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='notes' and policyname='notes_update_all') then
    create policy "notes_update_all" on public.notes for update using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='notes' and policyname='notes_delete_all') then
    create policy "notes_delete_all" on public.notes for delete using (true);
  end if;
end $$;
