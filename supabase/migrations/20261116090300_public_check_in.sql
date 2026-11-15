-- 0005: akses publik untuk halaman check-in.
-- events/participants tetap tertutup RLS; pengunjung tanpa login hanya bisa
-- lewat dua fungsi di bawah. Keduanya security definer + search_path kosong.

-- Info acara yang boleh dilihat publik (nama, jadwal, lokasi).
create or replace function public.public_event(p_slug text)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'id', e.id,
    'name', e.name,
    'slug', e.slug,
    'status', e.status,
    'start_at', e.config ->> 'start_at',
    'location', e.config ->> 'location'
  )
  from public.events e
  where e.slug = p_slug
    and e.status = 'Berlangsung'
  limit 1;
$$;

-- Check-in mandiri: peserta memasukkan kode unik, status dihitung di sini.
create or replace function public.check_in(p_slug text, p_code text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_event public.events;
  v_participant public.participants;
  v_status text;
  v_now timestamptz := now();
  v_start timestamptz;
begin
  select * into v_event
  from public.events e
  where e.slug = p_slug and e.status = 'Berlangsung'
  limit 1;

  if not found then
    return jsonb_build_object(
      'ok', false,
      'message', 'Acara tidak ditemukan atau belum aktif.'
    );
  end if;

  select * into v_participant
  from public.participants p
  where p.event_id = v_event.id
    and upper(p.code) = upper(btrim(p_code))
  limit 1;

  if not found then
    return jsonb_build_object(
      'ok', false,
      'message', 'Kode unik tidak ditemukan. Periksa kembali email pendaftaran.'
    );
  end if;

  if v_participant.checked_in_at is not null then
    return jsonb_build_object(
      'ok', false,
      'message', format(
        '%s sudah check-in pukul %s.',
        v_participant.name,
        to_char(
          v_participant.checked_in_at at time zone 'Asia/Jakarta',
          'HH24:MI'
        )
      )
    );
  end if;

  v_start := nullif(v_event.config ->> 'start_at', '')::timestamptz;

  v_status := case
    when v_start is not null and v_now > v_start + interval '30 minutes'
      then 'Terlambat'
    else 'Hadir'
  end;

  update public.participants
  set status = v_status,
      checked_in_at = v_now
  where id = v_participant.id;

  return jsonb_build_object(
    'ok', true,
    'message', format('%s tercatat %s.', v_participant.name, lower(v_status)),
    'name', v_participant.name,
    'status', v_status
  );
end;
$$;

grant execute on function public.public_event(text) to anon, authenticated;
grant execute on function public.check_in(text, text) to anon, authenticated;
