-- 0011: nomor sertifikat dibekukan per peserta (participants.cert_seq).
-- Sebelumnya nomor dihitung ulang dari urutan pendaftaran setiap kali dicek,
-- jadi peserta yang dihapus bisa menggeser nomor sertifikat yang sudah terbit.
-- Yang disimpan hanya urutannya; formatnya tetap dari certificates.config.numberFormat.

alter table public.participants
  add column if not exists cert_seq integer;

-- Isi nomor untuk peserta yang sudah ada, urut tanggal daftar (sama seperti
-- hitungan lama: registered_at lalu id sebagai tie-break).
with ranked as (
  select
    id,
    row_number() over (
      partition by event_id
      order by registered_at, id
    ) as seq
  from public.participants
)
update public.participants p
set cert_seq = ranked.seq
from ranked
where p.id = ranked.id
  and p.cert_seq is null;

create unique index if not exists participants_cert_seq_key
  on public.participants (event_id, cert_seq)
  where cert_seq is not null;

-- ---------------------------------------------------------------- pendaftaran

drop function if exists public.register_participant(text, text, text, text, text, text);

create or replace function public.register_participant(
  p_slug text,
  p_name text,
  p_email text,
  p_org text default null,
  p_phone text default null,
  p_job text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_event public.events;
  v_name text := btrim(coalesce(p_name, ''));
  v_email text := lower(btrim(coalesce(p_email, '')));
  v_org text := nullif(btrim(coalesce(p_org, '')), '');
  v_phone text := nullif(btrim(coalesce(p_phone, '')), '');
  v_job text := nullif(btrim(coalesce(p_job, '')), '');
  v_prefix text;
  v_quota integer;
  v_registered integer;
  v_cert integer;
  v_code text;
  v_try integer := 0;
begin
  if char_length(v_name) < 2 then
    return jsonb_build_object('ok', false, 'message', 'Nama minimal 2 karakter.');
  end if;

  if v_email !~ '^[^@[:space:]]+@[^@[:space:]]+[.][^@[:space:]]+$' then
    return jsonb_build_object('ok', false, 'message', 'Format email tidak valid.');
  end if;

  select * into v_event
  from public.events e
  where e.slug = p_slug and e.status = 'Berlangsung'
  limit 1;

  if not found then
    return jsonb_build_object(
      'ok', false,
      'message', 'Acara tidak ditemukan atau pendaftaran belum dibuka.'
    );
  end if;

  if exists (
    select 1 from public.participants p
    where p.event_id = v_event.id and lower(p.email) = v_email
  ) then
    return jsonb_build_object('ok', false, 'message', 'Email ini sudah terdaftar.');
  end if;

  v_quota := nullif(
    v_event.config #>> '{landing,registration,quota}',
    ''
  )::integer;

  if v_quota is not null then
    select count(*) into v_registered
    from public.participants p
    where p.event_id = v_event.id;

    if v_registered >= v_quota then
      return jsonb_build_object('ok', false, 'message', 'Kuota peserta sudah penuh.');
    end if;
  end if;

  -- Kunci baris event supaya dua pendaftar bersamaan tidak dapat nomor sama.
  perform 1 from public.events where id = v_event.id for update;

  select coalesce(max(p.cert_seq), 0) + 1
  into v_cert
  from public.participants p
  where p.event_id = v_event.id;

  v_prefix := upper(coalesce(
    nullif(btrim(v_event.config #>> '{registration,codePrefix}'), ''),
    substr(regexp_replace(v_event.slug, '[^a-zA-Z0-9]', '', 'g'), 1, 3)
  ));

  -- Bagian acak 4 karakter heksadesimal; bentrok sangat jarang, dicek dulu.
  loop
    v_try := v_try + 1;
    v_code := v_prefix || '-' || upper(substr(md5(random()::text), 1, 4));

    exit when not exists (
      select 1 from public.participants p
      where p.event_id = v_event.id and upper(p.code) = v_code
    );

    if v_try >= 10 then
      return jsonb_build_object(
        'ok', false,
        'message', 'Gagal membuat kode unik. Coba lagi.'
      );
    end if;
  end loop;

  insert into public.participants
    (event_id, name, email, org, phone, job, code, cert_seq)
  values
    (v_event.id, v_name, v_email, v_org, v_phone, v_job, v_code, v_cert);

  return jsonb_build_object(
    'ok', true,
    'message', 'Pendaftaran berhasil.',
    'name', v_name,
    'code', v_code
  );
end;
$$;

grant execute on function public.register_participant(text, text, text, text, text, text)
  to anon, authenticated;

-- ---------------------------------------------------------------- verifikasi

create or replace function public.verify_certificate(p_code text)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_row record;
  v_config jsonb;
  v_attended_only boolean;
  v_seq integer;
  v_format text;
begin
  select
    p.id,
    p.name,
    p.status,
    p.checked_in_at,
    p.registered_at,
    p.cert_seq,
    e.id as event_id,
    e.name as event_name,
    c.config
  into v_row
  from public.participants p
  join public.events e on e.id = p.event_id
  left join public.certificates c on c.event_id = e.id
  where upper(p.code) = upper(btrim(p_code))
  limit 1;

  if not found then
    return jsonb_build_object(
      'ok', false,
      'message', 'Kode sertifikat tidak ditemukan.'
    );
  end if;

  v_config := coalesce(v_row.config, '{}'::jsonb);
  v_attended_only := coalesce(
    (v_config #>> '{rules,attendedOnly}')::boolean,
    true
  );

  if v_attended_only and v_row.checked_in_at is null then
    return jsonb_build_object(
      'ok', false,
      'message', 'Peserta belum tercatat hadir, sertifikat ini belum berlaku.'
    );
  end if;

  -- Nomor dari kolom; hitung ulang hanya untuk baris lama yang belum terisi.
  v_seq := v_row.cert_seq;

  if v_seq is null then
    select count(*)
    into v_seq
    from public.participants p2
    where p2.event_id = v_row.event_id
      and (p2.registered_at, p2.id) <= (v_row.registered_at, v_row.id);
  end if;

  v_format := coalesce(
    nullif(v_config ->> 'numberFormat', ''),
    'SERT/{no}/2026'
  );

  return jsonb_build_object(
    'ok', true,
    'name', v_row.name,
    'event_name', v_row.event_name,
    'number', replace(v_format, '{no}', lpad(v_seq::text, 4, '0')),
    'issue_date', v_config ->> 'issueDate',
    'status', coalesce(v_row.status, 'Belum hadir'),
    'config', v_config
  );
end;
$$;

grant execute on function public.verify_certificate(text) to anon, authenticated;
