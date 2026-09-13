-- =====================================================================
--  JB Group website — dashboard backend schema
--  Run this once in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Content table: one row per section, value stored as jsonb.
-- ---------------------------------------------------------------------
create table if not exists public.site_content (
  id          text primary key,
  data        jsonb       not null,
  updated_at  timestamptz not null default now()
);

alter table public.site_content enable row level security;

-- Anyone (including logged-out site visitors) may READ content.
drop policy if exists "site_content_public_read" on public.site_content;
create policy "site_content_public_read"
  on public.site_content for select
  to anon, authenticated
  using (true);

-- Only signed-in dashboard users may WRITE content.
drop policy if exists "site_content_auth_insert" on public.site_content;
create policy "site_content_auth_insert"
  on public.site_content for insert
  to authenticated
  with check (true);

drop policy if exists "site_content_auth_update" on public.site_content;
create policy "site_content_auth_update"
  on public.site_content for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "site_content_auth_delete" on public.site_content;
create policy "site_content_auth_delete"
  on public.site_content for delete
  to authenticated
  using (true);

-- Keep updated_at honest even if a client forgets to send it.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists site_content_touch_updated_at on public.site_content;
create trigger site_content_touch_updated_at
  before update on public.site_content
  for each row execute function public.touch_updated_at();


-- ---------------------------------------------------------------------
-- 2. Media bucket: images uploaded from the dashboard media library.
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

-- Public read so <img src> works for site visitors.
drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'media');

-- Only signed-in users may upload, replace or delete media.
drop policy if exists "media_auth_insert" on storage.objects;
create policy "media_auth_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media');

drop policy if exists "media_auth_update" on storage.objects;
create policy "media_auth_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media')
  with check (bucket_id = 'media');

drop policy if exists "media_auth_delete" on storage.objects;
create policy "media_auth_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media');


-- =====================================================================
--  AFTER RUNNING THIS
--
--  1. Create your admin login:
--       Authentication → Users → "Add user" → enter email + password,
--       and tick "Auto Confirm User" so no email confirmation is needed.
--
--  2. Turn OFF public sign-ups so nobody can create their own admin account:
--       Authentication → Sign In / Providers → Email →
--       disable "Allow new users to sign up".
--
--  3. Copy your keys into the project's .env file:
--       Project Settings → Data API  → Project URL   -> VITE_SUPABASE_URL
--       Project Settings → API Keys  → anon / public -> VITE_SUPABASE_ANON_KEY
--
--  4. Open /dashboard, sign in, and press "Publish all sections" once to
--     seed the database with the site's current content.
-- =====================================================================
