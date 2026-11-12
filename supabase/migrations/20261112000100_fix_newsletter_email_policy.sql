alter policy "newsletter_subscribers_anon_insert"
  on public.newsletter_subscribers
  to anon
  with check (
    char_length(email) between 6 and 254
    and email = lower(btrim(email))
    and email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+[.][A-Z]{2,}$'
  );
