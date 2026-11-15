-- 0006: verifikasi sertifikat untuk halaman publik /verify/<kode>.
-- Nomor sertifikat dihitung dari urutan pendaftaran (deterministik, tanpa
-- kolom baru): peserta ke-1 -> 0001, dan seterusnya per event.

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
  v_number text;
begin
  select
    p.id,
    p.name,
    p.status,
    p.checked_in_at,
    p.registered_at,
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

  select count(*)
  into v_seq
  from public.participants p2
  where p2.event_id = v_row.event_id
    and (p2.registered_at, p2.id) <= (v_row.registered_at, v_row.id);

  v_number := lpad(v_seq::text, 4, '0');
  v_format := coalesce(
    nullif(v_config ->> 'numberFormat', ''),
    'SERT/{no}/2026'
  );

  return jsonb_build_object(
    'ok', true,
    'name', v_row.name,
    'event_name', v_row.event_name,
    'number', replace(v_format, '{no}', v_number),
    'issue_date', v_config ->> 'issueDate',
    'status', coalesce(v_row.status, 'Belum hadir')
  );
end;
$$;

grant execute on function public.verify_certificate(text) to anon, authenticated;
