create or replace function public.is_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select lower(btrim(coalesce((select auth.jwt() ->> 'email'), ''))) = 'artsquarein765@gmail.com';
$$;

revoke all on function public.is_admin() from public;
revoke all on function public.is_admin() from anon;
grant execute on function public.is_admin() to authenticated;
