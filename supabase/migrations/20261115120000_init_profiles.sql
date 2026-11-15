-- 0001: profil panitia.
-- Satu baris per auth.users, dibuat otomatis lewat trigger saat daftar.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'owner' check (role in ('owner', 'admin', 'staff')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: baca sendiri"
  on public.profiles for select
  to authenticated
  using (id = (select auth.uid()));

create policy "profiles: ubah sendiri"
  on public.profiles for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- Setiap user baru dibuatkan profil. "security definer" karena auth.users
-- tidak bisa ditulis dari role biasa.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
