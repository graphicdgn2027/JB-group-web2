-- =====================================================================
--  JB Group website — dashboard backend
--
--  Run the whole file in the Supabase SQL Editor
--  (Dashboard → SQL Editor → New query → paste → Run).
--  It is safe to run again after changes: every statement is idempotent,
--  and role permissions you customised in the dashboard are kept.
-- =====================================================================


-- ---------------------------------------------------------------------
-- 0. Configuration
-- ---------------------------------------------------------------------
-- The account with this email is always made Super Admin — whether it is
-- created before or after this script runs. Change it here if needed.
create table if not exists public.app_config (
  key   text primary key,
  value text not null
);
alter table public.app_config enable row level security;  -- no policies: server-side only

insert into public.app_config (key, value)
values ('super_admin_email', 'graphicdgn2027@gmail.com')
on conflict (key) do update set value = excluded.value;


-- ---------------------------------------------------------------------
-- 1. Roles and their permissions
-- ---------------------------------------------------------------------
create table if not exists public.roles (
  key         text primary key,
  label       text not null,
  description text not null default '',
  permissions jsonb not null default '{}'::jsonb check (jsonb_typeof(permissions) = 'object'),
  rank        int  not null default 0,          -- higher = more senior
  locked      boolean not null default false,   -- locked roles can't be edited
  updated_at  timestamptz not null default now()
);

insert into public.roles (key, label, description, permissions, rank, locked) values
  ('super_admin', 'Super Admin',
   'Full control of the dashboard, including users, roles and every setting.',
   '{}', 100, true),
  ('admin', 'Admin',
   'Runs the website: edits and publishes all content, manages media and site settings.',
   '{"content.edit": true, "content.publish": true, "media.upload": true, "media.delete": true, "settings.manage": true, "activity.view": true}',
   80, false),
  ('editor', 'Editor',
   'Edits and publishes content, and reviews work submitted by content creators.',
   '{"content.edit": true, "content.publish": true, "media.upload": true, "activity.view": true}',
   60, false),
  ('content_creator', 'Content Creator',
   'Writes and updates content on assigned pages, then submits it for review.',
   '{"content.edit": true, "media.upload": true}',
   40, false),
  ('viewer', 'Viewer',
   'Read-only access to the dashboard and the live preview.',
   '{}', 10, false)
on conflict (key) do update
  set label = excluded.label,
      description = excluded.description,
      rank = excluded.rank,
      locked = excluded.locked;
  -- permissions deliberately not overwritten, so dashboard edits survive re-runs


-- ---------------------------------------------------------------------
-- 2. Profiles: one per login, holding role and page access
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text not null default '',
  full_name  text not null default '',
  role       text not null default 'viewer' references public.roles (key) on update cascade,
  sections   text[],                 -- null = every page the role allows
  active     boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists profiles_role_idx on public.profiles (role);
alter table public.profiles enable row level security;


-- ---------------------------------------------------------------------
-- 3. Permission helpers (used by every policy below)
-- ---------------------------------------------------------------------
create or replace function public.all_permissions()
returns text[]
language sql immutable
as $$
  select array[
    'content.edit', 'content.publish',
    'media.upload', 'media.delete',
    'settings.manage', 'activity.view',
    'users.manage'
  ]
$$;

-- Null when the user has no profile or is disabled.
create or replace function public.effective_permissions(uid uuid)
returns jsonb
language sql stable security definer set search_path = public
as $$
  select case
           when p.role = 'super_admin'
             then (select jsonb_object_agg(k, true) from unnest(public.all_permissions()) as k)
           else coalesce(r.permissions, '{}'::jsonb)
         end
  from public.profiles p
  left join public.roles r on r.key = p.role
  where p.id = uid and p.active
$$;
revoke execute on function public.effective_permissions(uuid) from public, anon, authenticated;

create or replace function public.has_perm(p text)
returns boolean
language sql stable security definer set search_path = public
as $$
  select coalesce((public.effective_permissions(auth.uid()) ->> p)::boolean, false)
$$;

create or replace function public.is_super_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and active and role = 'super_admin'
  )
$$;

-- Can the current user edit the given content section?
create or replace function public.can_edit_section(s text)
returns boolean
language sql stable security definer set search_path = public
as $$
  select public.has_perm('content.edit')
     and (s <> 'settings' or public.has_perm('settings.manage'))
     and exists (
       select 1 from public.profiles
       where id = auth.uid()
         and active
         and (role = 'super_admin' or sections is null or s = any (sections))
     )
$$;

-- Everything the dashboard needs to know about the signed-in user.
create or replace function public.my_access()
returns jsonb
language sql stable security definer set search_path = public
as $$
  select jsonb_build_object(
    'id',          p.id,
    'email',       p.email,
    'full_name',   p.full_name,
    'role',        p.role,
    'role_label',  coalesce(r.label, p.role),
    'sections',    to_jsonb(p.sections),
    'active',      p.active,
    'permissions', coalesce(public.effective_permissions(p.id), '{}'::jsonb)
  )
  from public.profiles p
  left join public.roles r on r.key = p.role
  where p.id = auth.uid()
$$;


-- ---------------------------------------------------------------------
-- 4. Activity log
-- ---------------------------------------------------------------------
create table if not exists public.activity_log (
  id          bigint generated always as identity primary key,
  actor       uuid references auth.users (id) on delete set null,
  actor_email text not null default '',
  action      text not null,
  target      text not null default '',
  details     jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);
create index if not exists activity_log_created_idx on public.activity_log (created_at desc);
alter table public.activity_log enable row level security;

drop policy if exists "activity_select" on public.activity_log;
create policy "activity_select"
  on public.activity_log for select
  to authenticated
  using (public.has_perm('activity.view'));
-- No insert policy: entries are written only by the triggers below and by
-- the admin-users Edge Function.

create or replace function public.log_activity(p_action text, p_target text, p_details jsonb default '{}'::jsonb)
returns void
language sql security definer set search_path = public
as $$
  insert into public.activity_log (actor, actor_email, action, target, details)
  values (
    auth.uid(),
    coalesce((select email from public.profiles where id = auth.uid()), ''),
    p_action,
    coalesce(p_target, ''),
    coalesce(p_details, '{}'::jsonb)
  )
$$;
revoke execute on function public.log_activity(text, text, jsonb) from public, anon, authenticated;


-- ---------------------------------------------------------------------
-- 5. Profile lifecycle
-- ---------------------------------------------------------------------
-- Every new login gets a Viewer profile (or Super Admin for the configured email).
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  bootstrap text;
begin
  select value into bootstrap from public.app_config where key = 'super_admin_email';
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    case when bootstrap is not null and lower(new.email) = lower(bootstrap)
         then 'super_admin' else 'viewer' end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep the profile email in step with the login email.
create or replace function public.handle_user_email_change()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  update public.profiles set email = coalesce(new.email, '') where id = new.id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_email_changed on auth.users;
create trigger on_auth_user_email_changed
  after update of email on auth.users
  for each row
  when (old.email is distinct from new.email)
  execute function public.handle_user_email_change();

-- Rules for changing a profile, enforced no matter who asks.
create or replace function public.guard_profile_update()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  caller uuid := auth.uid();
  sensitive boolean :=
    new.role is distinct from old.role
    or new.active is distinct from old.active
    or new.sections is distinct from old.sections;
begin
  new.updated_at := now();

  -- SQL editor / service role: trusted.
  if caller is null then
    return new;
  end if;

  if not public.has_perm('users.manage') then
    if sensitive then
      raise exception 'You can only change your own name.' using errcode = '42501';
    end if;
    return new;
  end if;

  if sensitive and (old.role = 'super_admin' or new.role = 'super_admin')
     and not public.is_super_admin() then
    raise exception 'Only a Super Admin can change Super Admin accounts.' using errcode = '42501';
  end if;

  if old.id = caller and (new.role is distinct from old.role or new.active is distinct from old.active) then
    raise exception 'You can''t change your own role or disable your own account.' using errcode = '42501';
  end if;

  if old.role = 'super_admin' and old.active
     and (new.role <> 'super_admin' or not new.active)
     and (select count(*) from public.profiles where role = 'super_admin' and active) <= 1 then
    raise exception 'There must always be at least one active Super Admin.' using errcode = '42501';
  end if;

  return new;
end;
$$;

drop trigger if exists profiles_guard on public.profiles;
create trigger profiles_guard
  before update on public.profiles
  for each row execute function public.guard_profile_update();

create or replace function public.log_profile_update()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  changes jsonb := '{}'::jsonb;
begin
  if new.role is distinct from old.role then
    changes := changes || jsonb_build_object('role', jsonb_build_array(old.role, new.role));
  end if;
  if new.active is distinct from old.active then
    changes := changes || jsonb_build_object('active', jsonb_build_array(old.active, new.active));
  end if;
  if new.sections is distinct from old.sections then
    changes := changes || jsonb_build_object('sections', jsonb_build_array(to_jsonb(old.sections), to_jsonb(new.sections)));
  end if;
  if new.full_name is distinct from old.full_name then
    changes := changes || jsonb_build_object('full_name', jsonb_build_array(old.full_name, new.full_name));
  end if;
  if changes <> '{}'::jsonb then
    perform public.log_activity('user.updated', new.email, jsonb_build_object('user_id', new.id, 'changes', changes));
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_log on public.profiles;
create trigger profiles_log
  after update on public.profiles
  for each row execute function public.log_profile_update();

-- Profiles for logins that existed before this script ran.
insert into public.profiles (id, email, full_name, role)
select u.id, coalesce(u.email, ''), coalesce(u.raw_user_meta_data ->> 'full_name', ''), 'viewer'
from auth.users u
on conflict (id) do nothing;

-- Make sure the configured account is an active Super Admin.
update public.profiles p
set role = 'super_admin', active = true
from public.app_config c
where c.key = 'super_admin_email'
  and lower(p.email) = lower(c.value)
  and (p.role <> 'super_admin' or not p.active);

-- Profile policies: read and edit yourself; user managers see everyone.
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select"
  on public.profiles for select
  to authenticated
  using (id = auth.uid() or public.has_perm('users.manage'));

drop policy if exists "profiles_update" on public.profiles;
create policy "profiles_update"
  on public.profiles for update
  to authenticated
  using (id = auth.uid() or public.has_perm('users.manage'))
  with check (id = auth.uid() or public.has_perm('users.manage'));

-- Clients may only ever touch these columns; email follows the login.
revoke insert, update, delete on public.profiles from anon, authenticated;
grant update (full_name, role, sections, active) on public.profiles to authenticated;

-- User list for the Users page (includes sign-in times from auth).
create or replace function public.list_users()
returns table (
  id uuid,
  email text,
  full_name text,
  role text,
  sections text[],
  active boolean,
  created_at timestamptz,
  last_sign_in_at timestamptz,
  email_confirmed_at timestamptz
)
language sql stable security definer set search_path = public
as $$
  select p.id, p.email, p.full_name, p.role, p.sections, p.active, p.created_at,
         u.last_sign_in_at, u.email_confirmed_at
  from public.profiles p
  join auth.users u on u.id = p.id
  where public.has_perm('users.manage')
  order by p.created_at
$$;


-- ---------------------------------------------------------------------
-- 6. Role policies: everyone signed in can read; only Super Admins edit
-- ---------------------------------------------------------------------
alter table public.roles enable row level security;

drop policy if exists "roles_select" on public.roles;
create policy "roles_select"
  on public.roles for select
  to authenticated
  using (true);

drop policy if exists "roles_update" on public.roles;
create policy "roles_update"
  on public.roles for update
  to authenticated
  using (public.is_super_admin() and not locked)
  with check (public.is_super_admin() and not locked);

revoke insert, update, delete on public.roles from anon, authenticated;
grant update (label, description, permissions) on public.roles to authenticated;

create or replace function public.log_role_update()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  new.updated_at := now();
  if new.permissions is distinct from old.permissions then
    perform public.log_activity('role.updated', new.key,
      jsonb_build_object('before', old.permissions, 'after', new.permissions));
  end if;
  return new;
end;
$$;

drop trigger if exists roles_log on public.roles;
create trigger roles_log
  before update on public.roles
  for each row execute function public.log_role_update();


-- ---------------------------------------------------------------------
-- 7. Site content: public read, publish needs permission
-- ---------------------------------------------------------------------
create table if not exists public.site_content (
  id          text primary key,
  data        jsonb       not null,
  updated_at  timestamptz not null default now()
);
alter table public.site_content enable row level security;

drop policy if exists "site_content_public_read" on public.site_content;
create policy "site_content_public_read"
  on public.site_content for select
  to anon, authenticated
  using (true);

-- Replaced by the permission-based policies below.
drop policy if exists "site_content_auth_insert" on public.site_content;
drop policy if exists "site_content_auth_update" on public.site_content;
drop policy if exists "site_content_auth_delete" on public.site_content;

drop policy if exists "site_content_publish_insert" on public.site_content;
create policy "site_content_publish_insert"
  on public.site_content for insert
  to authenticated
  with check (public.has_perm('content.publish') and public.can_edit_section(id));

drop policy if exists "site_content_publish_update" on public.site_content;
create policy "site_content_publish_update"
  on public.site_content for update
  to authenticated
  using (public.has_perm('content.publish') and public.can_edit_section(id))
  with check (public.has_perm('content.publish') and public.can_edit_section(id));

drop policy if exists "site_content_super_delete" on public.site_content;
create policy "site_content_super_delete"
  on public.site_content for delete
  to authenticated
  using (public.is_super_admin());

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

create or replace function public.log_content_publish()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  perform public.log_activity('content.published', new.id, '{}'::jsonb);
  return new;
end;
$$;

drop trigger if exists site_content_log on public.site_content;
create trigger site_content_log
  after insert or update on public.site_content
  for each row execute function public.log_content_publish();


-- ---------------------------------------------------------------------
-- 8. Review workflow: creators submit, editors approve
-- ---------------------------------------------------------------------
create table if not exists public.content_submissions (
  id                 uuid primary key default gen_random_uuid(),
  section_id         text not null,
  data               jsonb not null,
  note               text not null default '',
  status             text not null default 'pending'
                     check (status in ('pending', 'approved', 'rejected', 'withdrawn')),
  submitted_by       uuid default auth.uid() references auth.users (id) on delete set null,
  submitted_by_email text not null default '',
  reviewed_by        uuid references auth.users (id) on delete set null,
  reviewed_by_email  text,
  review_note        text,
  created_at         timestamptz not null default now(),
  reviewed_at        timestamptz
);
create index if not exists content_submissions_status_idx
  on public.content_submissions (status, created_at desc);
alter table public.content_submissions enable row level security;

drop policy if exists "submissions_select" on public.content_submissions;
create policy "submissions_select"
  on public.content_submissions for select
  to authenticated
  using (submitted_by = auth.uid() or public.has_perm('content.publish'));

drop policy if exists "submissions_insert" on public.content_submissions;
create policy "submissions_insert"
  on public.content_submissions for insert
  to authenticated
  with check (submitted_by = auth.uid() and status = 'pending' and public.can_edit_section(section_id));

-- Submitters may only withdraw their own pending work; reviewers use the functions below.
drop policy if exists "submissions_withdraw" on public.content_submissions;
create policy "submissions_withdraw"
  on public.content_submissions for update
  to authenticated
  using (submitted_by = auth.uid() and status = 'pending')
  with check (submitted_by = auth.uid() and status = 'withdrawn');

revoke update, delete on public.content_submissions from anon, authenticated;
grant update (status) on public.content_submissions to authenticated;

create or replace function public.prepare_submission()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if auth.uid() is not null then
    new.submitted_by := auth.uid();
  end if;
  new.status := 'pending';
  new.submitted_by_email := coalesce((select email from public.profiles where id = new.submitted_by), '');
  return new;
end;
$$;

drop trigger if exists submissions_prepare on public.content_submissions;
create trigger submissions_prepare
  before insert on public.content_submissions
  for each row execute function public.prepare_submission();

create or replace function public.log_submission()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    perform public.log_activity('submission.created', new.section_id,
      jsonb_build_object('submission_id', new.id, 'note', new.note));
  elsif new.status is distinct from old.status then
    perform public.log_activity('submission.' || new.status, new.section_id,
      jsonb_build_object('submission_id', new.id, 'submitted_by', new.submitted_by_email,
                         'note', coalesce(new.review_note, '')));
  end if;
  return new;
end;
$$;

drop trigger if exists submissions_log on public.content_submissions;
create trigger submissions_log
  after insert or update on public.content_submissions
  for each row execute function public.log_submission();

drop function if exists public.approve_submission(uuid, text);
create or replace function public.approve_submission(submission_id uuid, p_note text default null)
returns void
language plpgsql security definer set search_path = public
as $$
declare
  s public.content_submissions;
begin
  select * into s from public.content_submissions where id = submission_id for update;
  if not found then
    raise exception 'Submission not found.';
  end if;
  if s.status <> 'pending' then
    raise exception 'This submission was already %.', s.status;
  end if;
  if not (public.has_perm('content.publish') and public.can_edit_section(s.section_id)) then
    raise exception 'You don''t have permission to publish this section.' using errcode = '42501';
  end if;

  insert into public.site_content (id, data, updated_at)
  values (s.section_id, s.data, now())
  on conflict (id) do update set data = excluded.data, updated_at = now();

  update public.content_submissions
  set status = 'approved',
      reviewed_by = auth.uid(),
      reviewed_by_email = (select email from public.profiles where id = auth.uid()),
      review_note = nullif(trim(coalesce(p_note, '')), ''),
      reviewed_at = now()
  where id = submission_id;
end;
$$;

drop function if exists public.reject_submission(uuid, text);
create or replace function public.reject_submission(submission_id uuid, p_note text)
returns void
language plpgsql security definer set search_path = public
as $$
declare
  s public.content_submissions;
begin
  select * into s from public.content_submissions where id = submission_id for update;
  if not found then
    raise exception 'Submission not found.';
  end if;
  if s.status <> 'pending' then
    raise exception 'This submission was already %.', s.status;
  end if;
  if not (public.has_perm('content.publish') and public.can_edit_section(s.section_id)) then
    raise exception 'You don''t have permission to review this section.' using errcode = '42501';
  end if;
  if coalesce(trim(p_note), '') = '' then
    raise exception 'Add a note so the author knows what to change.';
  end if;

  update public.content_submissions
  set status = 'rejected',
      reviewed_by = auth.uid(),
      reviewed_by_email = (select email from public.profiles where id = auth.uid()),
      review_note = trim(p_note),
      reviewed_at = now()
  where id = submission_id;
end;
$$;


-- ---------------------------------------------------------------------
-- 9. Media bucket
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'media');

-- Replaced by the permission-based policies below.
drop policy if exists "media_auth_insert" on storage.objects;
drop policy if exists "media_auth_update" on storage.objects;
drop policy if exists "media_auth_delete" on storage.objects;

drop policy if exists "media_upload" on storage.objects;
create policy "media_upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media' and public.has_perm('media.upload'));

drop policy if exists "media_replace" on storage.objects;
create policy "media_replace"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media' and public.has_perm('media.upload'))
  with check (bucket_id = 'media' and public.has_perm('media.upload'));

drop policy if exists "media_remove" on storage.objects;
create policy "media_remove"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media' and public.has_perm('media.delete'));


-- =====================================================================
--  AFTER RUNNING THIS — see DASHBOARD.md for the full walkthrough
--
--  1. Create your Super Admin login:
--       Authentication → Users → Add user → graphicdgn2027@gmail.com,
--       choose a password, tick "Auto Confirm User".
--       It becomes Super Admin automatically.
--
--  2. Turn OFF public sign-ups:
--       Authentication → Sign In / Providers → Email →
--       disable "Allow new users to sign up".
--
--  3. Deploy the user-management function (supabase/functions/admin-users)
--     so Super Admins can create, edit and delete users from the dashboard.
--
--  4. Open /dashboard, sign in, and press "Seed database" on the Overview.
-- =====================================================================
