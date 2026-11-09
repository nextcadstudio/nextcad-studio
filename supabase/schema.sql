create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  category text not null default 'Other',
  software text not null default '',
  creator_name text not null default 'RenderHub Creator',
  image_url text not null,
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_status_created_idx
  on public.projects(status, created_at desc);

create or replace function public.is_renderhub_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users au
    where au.user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_renderhub_admin() from public;
grant execute on function public.is_renderhub_admin() to authenticated;

alter table public.admin_users enable row level security;
alter table public.projects enable row level security;

drop policy if exists "admins can read admin list" on public.admin_users;
create policy "admins can read admin list"
on public.admin_users for select
to authenticated
using (public.is_renderhub_admin());

drop policy if exists "public reads published projects" on public.projects;
create policy "public reads published projects"
on public.projects for select
to anon, authenticated
using (status = 'published' or public.is_renderhub_admin());

drop policy if exists "admins insert projects" on public.projects;
create policy "admins insert projects"
on public.projects for insert
to authenticated
with check (public.is_renderhub_admin());

drop policy if exists "admins update projects" on public.projects;
create policy "admins update projects"
on public.projects for update
to authenticated
using (public.is_renderhub_admin())
with check (public.is_renderhub_admin());

drop policy if exists "admins delete projects" on public.projects;
create policy "admins delete projects"
on public.projects for delete
to authenticated
using (public.is_renderhub_admin());

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at
before update on public.projects
for each row execute function public.set_updated_at();
