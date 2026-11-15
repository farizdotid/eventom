-- 0004: sertifikat.
-- Satu baris per event. Semua isi editor (template, teks, penandatangan,
-- aturan) disimpan utuh sebagai config supaya cocok dengan tipe CertificateConfig.

create table if not exists public.certificates (
  event_id uuid primary key references public.events (id) on delete cascade,
  config jsonb not null default '{}'::jsonb,
  issued integer not null default 0 check (issued >= 0),
  updated_at timestamptz not null default now()
);

alter table public.certificates enable row level security;

drop policy if exists "certificates: pemilik event" on public.certificates;

create policy "certificates: pemilik event"
  on public.certificates for all
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
