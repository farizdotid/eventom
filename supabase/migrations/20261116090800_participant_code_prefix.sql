-- 0010: kode peserta pakai prefix acara, format <PREFIX>-XXXX (contoh UX3-11ST).
-- Prefix diambil dari events.config.registration.codePrefix; kalau kosong,
-- dari 3 karakter alfanumerik pertama slug (uiux-batch-3 -> UIU).
-- Tanpa prefix, kode lama 4 karakter tetap valid saat check-in/verifikasi.

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

  insert into public.participants (event_id, name, email, org, phone, job, code)
  values (v_event.id, v_name, v_email, v_org, v_phone, v_job, v_code);

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
