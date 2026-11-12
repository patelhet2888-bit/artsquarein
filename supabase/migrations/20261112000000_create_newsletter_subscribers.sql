create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (char_length(email) between 6 and 254),
  created_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

drop policy if exists "newsletter_subscribers_anon_insert" on public.newsletter_subscribers;
create policy "newsletter_subscribers_anon_insert"
  on public.newsletter_subscribers
  for insert
  to anon
  with check (
    char_length(email) between 6 and 254
    and email = lower(btrim(email))
    and email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$'
  );
