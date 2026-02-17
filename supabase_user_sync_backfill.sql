-- Run this script in Supabase SQL Editor to sync ALL existing users
-- from the Authentication system (auth.users) to your public table (public.users).

insert into public.users (id, email, full_name, avatar_url)
select 
  id, 
  email, 
  raw_user_meta_data->>'full_name', 
  raw_user_meta_data->>'avatar_url'
from auth.users
on conflict (id) do nothing;

-- Success message (optional, some editors might not show this)
-- select 'Backfill complete: Users synced to public.users' as status;
