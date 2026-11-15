-- 0003: peserta.
-- `status` disimpan eksplisit (bukan dihitung dari checked_in_at) supaya
-- aturan terlambat bisa diubah tanpa migrasi data.

create table if not exists public.participants (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  name text not null,
  email text not null,
  org text,
  phone text,
  code text not null,
  status text not null default 'Belum hadir'
    check (status in ('Hadir', 'Terlambat', 'Belum hadir')),
  checked_in_at timestamptz,
  registered_at timestamptz not null default now(),
  unique (event_id, code),
  unique (event_id, email)
);

create index if not exists participants_event_id_idx on public.participants (event_id);

alter table public.participants enable row level security;

drop policy if exists "participants: pemilik event" on public.participants;

create policy "participants: pemilik event"
  on public.participants for all
  to authenticated
  using (
    exists (
      select 1 from public.events e
      where e.id = event_id and e.owner_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.events e
      where e.id = event_id and e.owner_id = (select auth.uid())
    )
  );
