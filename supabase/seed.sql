-- Seed contoh. Jalankan SETELAH daftar akun pertama, supaya ada owner.
-- Aman diulang: slug unik + on conflict.

insert into public.events (owner_id, name, slug, status, config)
select
  p.id,
  'Workshop UI/UX Batch 3',
  'uiux-batch-3',
  'Berlangsung',
  jsonb_build_object(
    'registration_url', 'eventom.id/uiux-batch-3',
    'theme', 'lilac',
    'start_at', '2026-10-29T08:00:00+07:00',
    'end_at', '2026-10-29T14:00:00+07:00',
    'location', 'Jogja Digital Valley, Yogyakarta',
    'format', 'Offline',
    'quota', 300,
    'price', 'Gratis'
  )
from public.profiles p
order by p.created_at
limit 1
on conflict (slug) do nothing;
