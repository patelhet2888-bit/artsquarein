insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'art-square-order-references',
  'art-square-order-references',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;
