# Supabase

SQL di sini di-paste manual ke **Supabase Dashboard → SQL Editor**, urut nama file.

## Urutan paste

1. `migrations/20261115120000_init_profiles.sql` — profil + trigger saat signup
2. `migrations/20261116090000_init_events.sql` — tabel `events`
3. `migrations/20261116090100_init_participants.sql` — tabel `participants`
4. `migrations/20261116090200_init_certificates.sql` — tabel `certificates`
5. `migrations/20261116090300_public_check_in.sql` — RPC `public_event()` + `check_in()`
6. `migrations/20261116090400_verify_certificate.sql` — RPC `verify_certificate()`
7. `migrations/20261116090500_public_landing.sql` — RPC `public_event()` (versi landing) + `register_participant()`
8. `migrations/20261116090600_verify_certificate_config.sql` — `verify_certificate()` ikut mengirim `config` sertifikat
9. `migrations/20261116090700_participant_job.sql` — kolom `participants.job` + `register_participant()` menerima `p_job`
10. `migrations/20261116090800_participant_code_prefix.sql` — kode peserta berformat `<PREFIX>-XXXX`
11. `migrations/20261116090900_certificate_number_seq.sql` — nomor sertifikat dibekukan di `participants.cert_seq`
12. `migrations/20261116091000_storage_event_assets.sql` — bucket Storage `event-assets` (banner acara, maks 5 MB)
13. `seed.sql` — contoh event (jalankan setelah punya akun, boleh dilewati)
14. `seed-participants.sql` — 48 peserta contoh untuk event `uiux-batch-3` (opsional)

Semua file idempotent (`create table if not exists`, `drop policy if exists`),
aman di-paste ulang.

## Struktur

| Lokasi | Isi |
| --- | --- |
| `supabase/migrations/` | SQL versioned, urut nama file |
| `supabase/seed.sql` | Data contoh, dijalankan manual |
| `supabase/seed-participants.sql` | Peserta contoh, opsional |
| `supabase/functions/` | Edge functions. Belum dipakai — check-in publik cukup RPC, jadi folder ini kosong sampai benar-benar butuh |
| `storage` bucket `event-assets` | Aset acara (banner). Publik baca; tulis hanya pemilik event, di folder `<event_id>/` |
| `src/lib/supabase/queries/` | Query yang dipakai app (server-side), ikut typecheck Next |

## Setelah schema berubah

- `src/types/database.types.ts` masih ditulis tangan. Kalau punya Supabase CLI:
  `npx supabase gen types typescript --linked > src/types/database.types.ts`
- Lalu `npx tsc --noEmit`.

## Halaman publik

- `/e/<slug>` — landing page acara dari `events.config.landing` + form pendaftaran. Submit → RPC `register_participant()` (cek kuota, email duplikat, buat kode unik).
- `/checkin/<slug>` — peserta scan QR, masukkan kode unik. Tanpa login, lewat RPC `check_in()`.
- `/verify/<kode>` — cek keaslian sertifikat; nomor dihitung dari urutan pendaftaran, lewat RPC `verify_certificate()`.
- `/sertifikat/<kode>` — versi cetak sertifikat (A4 landscape), tombol "Cetak / Simpan PDF" pakai `window.print()`. Menolak kode peserta yang belum check-in (aturan `rules.attendedOnly`).

## Format kode peserta

`register_participant()` menghasilkan `<PREFIX>-XXXX`, contoh `UX3-11ST`.
Prefix diambil dari `events.config.registration.codePrefix`; kalau kosong, dari 3 karakter
alfanumerik pertama slug (`uiux-batch-3` → `UIU`). Untuk menyamakan dengan data contoh:

```sql
update public.events
set config = jsonb_set(coalesce(config, '{}'::jsonb), '{registration,codePrefix}', '"UX3"')
where slug = 'uiux-batch-3';
```

Kode 4 karakter tanpa prefix tetap valid saat check-in dan verifikasi.

## Auth

- Email confirmation: aktifkan di **Authentication → Providers → Email**, lalu
  tambahkan `http://localhost:3000/auth/callback` ke **URL Configuration**.
- Demo mode (`NEXT_PUBLIC_DEMO_MODE=true`) mematikan seluruh jalur Supabase dan
  memakai data di `src/lib/demo-data.ts`. Data itu tetap disimpan sebagai
  referensi dan sumber isi `seed.sql`.
