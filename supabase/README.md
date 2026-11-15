# Supabase

SQL di sini di-paste manual ke **Supabase Dashboard → SQL Editor**, urut nama file.

## Urutan paste

1. `migrations/20261115120000_init_profiles.sql` — profil + trigger saat signup
2. `migrations/20261116090000_init_events.sql` — tabel `events`
3. `migrations/20261116090100_init_participants.sql` — tabel `participants`
4. `migrations/20261116090200_init_certificates.sql` — tabel `certificates`
5. `seed.sql` — contoh event (jalankan setelah punya akun, boleh dilewati)

Semua file idempotent (`create table if not exists`, `drop policy if exists`),
aman di-paste ulang.

## Struktur

| Lokasi | Isi |
| --- | --- |
| `supabase/migrations/` | SQL versioned, urut nama file |
| `supabase/seed.sql` | Data contoh, dijalankan manual |
| `supabase/functions/` | Edge functions. Belum dipakai — check-in publik cukup RPC, jadi folder ini kosong sampai benar-benar butuh |
| `src/lib/supabase/queries/` | Query yang dipakai app (server-side), ikut typecheck Next |

## Setelah schema berubah

- `src/types/database.types.ts` masih ditulis tangan. Kalau punya Supabase CLI:
  `npx supabase gen types typescript --linked > src/types/database.types.ts`
- Lalu `npx tsc --noEmit`.

## Auth

- Email confirmation: aktifkan di **Authentication → Providers → Email**, lalu
  tambahkan `http://localhost:3000/auth/callback` ke **URL Configuration**.
- Demo mode (`NEXT_PUBLIC_DEMO_MODE=true`) mematikan seluruh jalur Supabase dan
  memakai data di `src/lib/demo-data.ts`. Data itu tetap disimpan sebagai
  referensi dan sumber isi `seed.sql`.
