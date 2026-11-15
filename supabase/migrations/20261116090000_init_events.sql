-- 0002: event.
-- Identitas event saja; semua isi yang diedit lewat editor (jadwal, landing,
-- pendaftaran, tema) masuk ke kolom config (jsonb) supaya 1 baris = 1 event.

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  slug text not null unique,
  status text not null default 'Draft' check (status in ('Draft', 'Berlangsung', 'Selesai')),
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists events_owner_id_idx on public.events (owner_id);

alter table public.events enable row level security;

drop policy if exists "events: pemilik" on public.events;

create policy "events: pemilik"
  on public.events for all
  to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));
