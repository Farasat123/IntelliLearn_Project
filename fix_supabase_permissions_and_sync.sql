-- MASTER FIX SCRIPT (UPDATED)
-- This script will:
-- 1. Ensure public.users table exists AND has all required columns
-- 2. Fix permissions (RLS) so the frontend can read/write it
-- 3. Force-sync all users from Auth to Public

-- 1. Create table if it doesn't exist
create table if not exists public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 1b. Add missing columns safely (in case table already existed without them)
do $$
begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='users' and column_name='full_name') then
    alter table public.users add column full_name text;
  end if;
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='users' and column_name='avatar_url') then
    alter table public.users add column avatar_url text;
  end if;
end $$;

-- 2. Enable RLS (Row Level Security)
alter table public.users enable row level security;

-- 3. Create policies (Drop existing first to avoid errors)
drop policy if exists "Public profiles are viewable by everyone." on public.users;
drop policy if exists "Users can insert their own profile." on public.users;
drop policy if exists "Users can update own profile." on public.users;

create policy "Public profiles are viewable by everyone."
  on public.users for select
  using ( true );

create policy "Users can insert their own profile."
  on public.users for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on public.users for update
  using ( auth.uid() = id );

-- 4. Force Backfill Again (Sync existing users)
insert into public.users (id, email, full_name, avatar_url)
select 
  id, 
  email, 
  raw_user_meta_data->>'full_name', 
  raw_user_meta_data->>'avatar_url'
from auth.users
on conflict (id) do nothing;

-- 5. Re-create the Trigger
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
