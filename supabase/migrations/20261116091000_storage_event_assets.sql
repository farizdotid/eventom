-- 0012: bucket Storage untuk aset acara (banner dulu, logo/ttd menyusul).
-- Publik boleh baca (banner tampil di landing page), hanya pemilik event
-- yang boleh menulis, dan hanya di folder <event_id>/ miliknya sendiri.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'event-assets',
  'event-assets',
  true,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "event assets read" on storage.objects;
drop policy if exists "event assets insert" on storage.objects;
drop policy if exists "event assets update" on storage.objects;
drop policy if exists "event assets delete" on storage.objects;

create policy "event assets read"
  on storage.objects for select
  using (bucket_id = 'event-assets');

create policy "event assets insert"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'event-assets'
    and (storage.foldername(name))[1] in (
      select e.id::text from public.events e where e.owner_id = auth.uid()
    )
  );

create policy "event assets update"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'event-assets'
    and (storage.foldername(name))[1] in (
      select e.id::text from public.events e where e.owner_id = auth.uid()
    )
  );

create policy "event assets delete"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'event-assets'
    and (storage.foldername(name))[1] in (
      select e.id::text from public.events e where e.owner_id = auth.uid()
    )
  );
