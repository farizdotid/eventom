-- Seed peserta contoh (opsional). Jalankan SETELAH seed event.
-- Sumber: src/lib/demo-data.ts. Aman diulang: conflict pada (event_id, email).

insert into public.participants
  (event_id, name, email, org, phone, code, status, checked_in_at, registered_at, cert_seq)
select
  e.id,
  v.name,
  v.email,
  v.org,
  v.phone,
  v.code,
  v.status,
  v.checked_in_at,
  timestamptz '2026-10-29 08:00:00+07' + (v.idx - 1) * interval '9 hours',
  v.idx
from public.events e
cross join (
  values
    (1, 'Bagas Saputra', 'bagas.saputra@mail.com', 'Universitas Gadjah Mada', '0812-1000-1000', 'UX3-02EV', 'Terlambat', timestamptz '2026-10-29 09:05:00+07'),
    (2, 'Nadia Anjani', 'nadia.anjani@mail.com', 'ITB', '0812-1037-1053', 'UX3-036K', 'Hadir', timestamptz '2026-10-29 08:17:00+07'),
    (3, 'Fajar Firmansyah', 'fajar.firmansyah@mail.com', 'Agensi Kreatif Rupa', '0812-1074-1106', 'UX3-03Y9', 'Hadir', timestamptz '2026-10-29 08:24:00+07'),
    (4, 'Laras Lestari', 'laras.lestari@mail.com', 'Universitas Indonesia', '0812-1111-1159', 'UX3-04PY', 'Belum hadir', null::timestamptz),
    (5, 'Yoga Santoso', 'yoga.santoso@mail.com', 'Universitas Brawijaya', '0812-1148-1212', 'UX3-05HN', 'Hadir', timestamptz '2026-10-29 08:38:00+07'),
    (6, 'Citra Maharani', 'citra.maharani@mail.com', 'PT Telkom Indonesia', '0812-1185-1265', 'UX3-069C', 'Terlambat', timestamptz '2026-10-29 09:11:00+07'),
    (7, 'Rizky Wijaya', 'rizky.wijaya@mail.com', 'Bank Mandiri', '0812-1222-1318', 'UX3-0711', 'Hadir', timestamptz '2026-10-29 08:52:00+07'),
    (8, 'Dewi Putri', 'dewi.putri@mail.com', 'Binus University', '0812-1259-1371', 'UX3-07SQ', 'Hadir', timestamptz '2026-10-29 08:14:00+07'),
    (9, 'Ahmad Fauzi', 'ahmad.fauzi@mail.com', 'Startup Kopi Kita', '0812-1296-1424', 'UX3-08KF', 'Belum hadir', null::timestamptz),
    (10, 'Putri Kartika', 'putri.kartika@mail.com', 'Pemprov Jawa Barat', '0812-1333-1477', 'UX3-09C4', 'Hadir', timestamptz '2026-10-29 08:28:00+07'),
    (11, 'Salsa Anggraini', 'salsa.anggraini@mail.com', 'Tokopedia', '0812-1370-1530', 'UX3-0A3T', 'Terlambat', timestamptz '2026-10-29 09:17:00+07'),
    (12, 'Reza Hidayat', 'reza.hidayat@mail.com', 'Universitas Airlangga', '0812-1407-1583', 'UX3-0AVI', 'Hadir', timestamptz '2026-10-29 08:42:00+07'),
    (13, 'Nabila Rahmawati', 'nabila.rahmawati@mail.com', 'Universitas Gadjah Mada', '0812-1444-1636', 'UX3-0BN7', 'Hadir', timestamptz '2026-10-29 08:49:00+07'),
    (14, 'Wahyu Ramadhan', 'wahyu.ramadhan@mail.com', 'ITB', '0812-1481-1689', 'UX3-0CEW', 'Belum hadir', null::timestamptz),
    (15, 'Intan Permatasari', 'intan.permatasari@mail.com', 'Agensi Kreatif Rupa', '0812-1518-1742', 'UX3-0D6L', 'Hadir', timestamptz '2026-10-29 08:18:00+07'),
    (16, 'Dimas Pratama', 'dimas.pratama@mail.com', 'Universitas Indonesia', '0812-1555-1795', 'UX3-0DYA', 'Terlambat', timestamptz '2026-10-29 09:23:00+07'),
    (17, 'Ayu Safitri', 'ayu.safitri@mail.com', 'Universitas Brawijaya', '0812-1592-1848', 'UX3-0EPZ', 'Hadir', timestamptz '2026-10-29 08:32:00+07'),
    (18, 'Bayu Nugroho', 'bayu.nugroho@mail.com', 'PT Telkom Indonesia', '0812-1629-1901', 'UX3-0FHO', 'Hadir', timestamptz '2026-10-29 08:39:00+07'),
    (19, 'Maya Sari', 'maya.sari@mail.com', 'Bank Mandiri', '0812-1666-1954', 'UX3-0G9D', 'Belum hadir', null::timestamptz),
    (20, 'Fikri Maulana', 'fikri.maulana@mail.com', 'Binus University', '0812-1703-2007', 'UX3-0H12', 'Hadir', timestamptz '2026-10-29 08:53:00+07'),
    (21, 'Rani Oktaviani', 'rani.oktaviani@mail.com', 'Startup Kopi Kita', '0812-1740-2060', 'UX3-0HSR', 'Terlambat', timestamptz '2026-10-29 09:29:00+07'),
    (22, 'Galih Prakoso', 'galih.prakoso@mail.com', 'Pemprov Jawa Barat', '0812-1777-2113', 'UX3-0IKG', 'Hadir', timestamptz '2026-10-29 08:22:00+07'),
    (23, 'Sinta Wulandari', 'sinta.wulandari@mail.com', 'Tokopedia', '0812-1814-2166', 'UX3-0JC5', 'Hadir', timestamptz '2026-10-29 08:29:00+07'),
    (24, 'Arif Setiawan', 'arif.setiawan@mail.com', 'Universitas Airlangga', '0812-1851-2219', 'UX3-0K3U', 'Belum hadir', null::timestamptz),
    (25, 'Bagas Saputra Putra', 'bagas.saputra2@mail.com', 'Universitas Gadjah Mada', '0812-1888-2272', 'UX3-0KVJ', 'Hadir', timestamptz '2026-10-29 08:43:00+07'),
    (26, 'Nadia Anjani Putra', 'nadia.anjani2@mail.com', 'ITB', '0812-1925-2325', 'UX3-0LN8', 'Terlambat', timestamptz '2026-10-29 09:35:00+07'),
    (27, 'Fajar Firmansyah Putra', 'fajar.firmansyah2@mail.com', 'Agensi Kreatif Rupa', '0812-1962-2378', 'UX3-0MEX', 'Hadir', timestamptz '2026-10-29 08:12:00+07'),
    (28, 'Laras Lestari Putra', 'laras.lestari2@mail.com', 'Universitas Indonesia', '0812-1999-2431', 'UX3-0N6M', 'Hadir', timestamptz '2026-10-29 08:19:00+07'),
    (29, 'Yoga Santoso Putra', 'yoga.santoso2@mail.com', 'Universitas Brawijaya', '0812-2036-2484', 'UX3-0NYB', 'Belum hadir', null::timestamptz),
    (30, 'Citra Maharani Putra', 'citra.maharani2@mail.com', 'PT Telkom Indonesia', '0812-2073-2537', 'UX3-0OQ0', 'Hadir', timestamptz '2026-10-29 08:33:00+07'),
    (31, 'Rizky Wijaya Putra', 'rizky.wijaya2@mail.com', 'Bank Mandiri', '0812-2110-2590', 'UX3-0PHP', 'Hadir', timestamptz '2026-10-29 08:40:00+07'),
    (32, 'Dewi Putri Putra', 'dewi.putri2@mail.com', 'Binus University', '0812-2147-2643', 'UX3-0Q9E', 'Hadir', timestamptz '2026-10-29 08:47:00+07'),
    (33, 'Ahmad Fauzi Putra', 'ahmad.fauzi2@mail.com', 'Startup Kopi Kita', '0812-2184-2696', 'UX3-0R13', 'Hadir', timestamptz '2026-10-29 08:54:00+07'),
    (34, 'Putri Kartika Putra', 'putri.kartika2@mail.com', 'Pemprov Jawa Barat', '0812-2221-2749', 'UX3-0RSS', 'Belum hadir', null::timestamptz),
    (35, 'Salsa Anggraini Putra', 'salsa.anggraini2@mail.com', 'Tokopedia', '0812-2258-2802', 'UX3-0SKH', 'Hadir', timestamptz '2026-10-29 08:23:00+07'),
    (36, 'Reza Hidayat Putra', 'reza.hidayat2@mail.com', 'Universitas Airlangga', '0812-2295-2855', 'UX3-0TC6', 'Hadir', timestamptz '2026-10-29 08:30:00+07'),
    (37, 'Nabila Rahmawati Putra', 'nabila.rahmawati2@mail.com', 'Universitas Gadjah Mada', '0812-2332-2908', 'UX3-0U3V', 'Hadir', timestamptz '2026-10-29 08:37:00+07'),
    (38, 'Wahyu Ramadhan Putra', 'wahyu.ramadhan2@mail.com', 'ITB', '0812-2369-2961', 'UX3-0UVK', 'Hadir', timestamptz '2026-10-29 08:44:00+07'),
    (39, 'Intan Permatasari Putra', 'intan.permatasari2@mail.com', 'Agensi Kreatif Rupa', '0812-2406-3014', 'UX3-0VN9', 'Belum hadir', null::timestamptz),
    (40, 'Dimas Pratama Putra', 'dimas.pratama2@mail.com', 'Universitas Indonesia', '0812-2443-3067', 'UX3-0WEY', 'Hadir', timestamptz '2026-10-29 08:13:00+07'),
    (41, 'Ayu Safitri Putra', 'ayu.safitri2@mail.com', 'Universitas Brawijaya', '0812-2480-3120', 'UX3-0X6N', 'Hadir', timestamptz '2026-10-29 08:20:00+07'),
    (42, 'Bayu Nugroho Putra', 'bayu.nugroho2@mail.com', 'PT Telkom Indonesia', '0812-2517-3173', 'UX3-0XYC', 'Hadir', timestamptz '2026-10-29 08:27:00+07'),
    (43, 'Maya Sari Putra', 'maya.sari2@mail.com', 'Bank Mandiri', '0812-2554-3226', 'UX3-0YQ1', 'Hadir', timestamptz '2026-10-29 08:34:00+07'),
    (44, 'Fikri Maulana Putra', 'fikri.maulana2@mail.com', 'Binus University', '0812-2591-3279', 'UX3-0ZHQ', 'Belum hadir', null::timestamptz),
    (45, 'Rani Oktaviani Putra', 'rani.oktaviani2@mail.com', 'Startup Kopi Kita', '0812-2628-3332', 'UX3-109F', 'Hadir', timestamptz '2026-10-29 08:48:00+07'),
    (46, 'Galih Prakoso Putra', 'galih.prakoso2@mail.com', 'Pemprov Jawa Barat', '0812-2665-3385', 'UX3-1114', 'Hadir', timestamptz '2026-10-29 08:10:00+07'),
    (47, 'Sinta Wulandari Putra', 'sinta.wulandari2@mail.com', 'Tokopedia', '0812-2702-3438', 'UX3-11ST', 'Hadir', timestamptz '2026-10-29 08:17:00+07'),
    (48, 'Arif Setiawan Putra', 'arif.setiawan2@mail.com', 'Universitas Airlangga', '0812-2739-3491', 'UX3-12KI', 'Hadir', timestamptz '2026-10-29 08:24:00+07')
) as v (idx, name, email, org, phone, code, status, checked_in_at)
where e.slug = 'uiux-batch-3'
on conflict (event_id, email) do nothing;
