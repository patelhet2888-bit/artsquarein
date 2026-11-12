create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  file_name text not null,
  mime_type text not null check (mime_type in ('image/jpeg', 'image/png', 'image/webp')),
  size_bytes bigint not null check (size_bytes between 1 and 5242880),
  alt_text text not null default '',
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (char_length(btrim(name)) between 1 and 100),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text not null default '',
  cover_media_id uuid references public.media_assets(id) on delete set null,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  product_code text not null unique check (char_length(btrim(product_code)) between 2 and 50),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null check (char_length(btrim(name)) between 1 and 180),
  category_id uuid not null references public.categories(id) on delete restrict,
  short_description text not null default '',
  description text not null default '',
  price_inr numeric(12, 2) check (price_inr is null or price_inr >= 0),
  material text not null default '',
  dimensions text not null default '',
  variants text[] not null default '{}',
  search_tags text[] not null default '{}',
  customization text not null default 'by_request' check (customization in ('by_request', 'available', 'not_available')),
  availability text not null default 'unknown' check (availability in ('unknown', 'in_stock', 'out_of_stock', 'made_to_order')),
  stock_quantity integer check (stock_quantity is null or stock_quantity >= 0),
  is_featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  media_asset_id uuid not null references public.media_assets(id) on delete restrict,
  alt_text text not null default '',
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  unique (product_id, media_asset_id),
  unique (product_id, sort_order)
);

create unique index if not exists product_images_one_primary_per_product
  on public.product_images(product_id) where is_primary;

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 120),
  email text not null check (char_length(email) between 6 and 254),
  country text not null check (char_length(btrim(country)) between 2 and 80),
  whatsapp_number text not null check (char_length(btrim(whatsapp_number)) between 6 and 32),
  product_id uuid references public.products(id) on delete set null,
  product_name_snapshot text not null default '',
  product_code_snapshot text not null default '',
  message text not null check (char_length(btrim(message)) between 3 and 5000),
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id boolean primary key default true check (id),
  brand_name text not null default 'ART SQUARE',
  tagline text not null default 'Where art meets elegance',
  whatsapp_number text not null default '919054934190',
  instagram_url text not null default 'https://www.instagram.com/art_square_in/',
  contact_email text,
  announcement_text text not null default '',
  hero_headline text not null default 'Art That Makes Every Space Special.',
  hero_subheadline text not null default 'Discover thoughtfully handcrafted creations that bring together Indian artistry, meaningful details and timeless elegance.',
  hero_cta_label text not null default 'Explore Collections',
  hero_media_id uuid references public.media_assets(id) on delete set null,
  logo_media_id uuid references public.media_assets(id) on delete set null,
  updated_at timestamptz not null default now()
);

create index if not exists products_public_catalog_idx
  on public.products(status, sort_order, created_at desc);
create index if not exists products_category_idx
  on public.products(category_id, status, sort_order);
create index if not exists products_search_idx
  on public.products using gin(search_tags);
create index if not exists categories_visibility_idx
  on public.categories(is_visible, sort_order);
create index if not exists product_images_product_sort_idx
  on public.product_images(product_id, sort_order);
create index if not exists media_assets_created_idx
  on public.media_assets(created_at desc);
create index if not exists enquiries_inbox_idx
  on public.enquiries(status, created_at desc);
create index if not exists enquiries_product_idx
  on public.enquiries(product_id, created_at desc);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = (select auth.uid())
  );
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

alter table public.admin_users enable row level security;
alter table public.media_assets enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.enquiries enable row level security;
alter table public.site_settings enable row level security;

 drop policy if exists admin_users_select_self on public.admin_users;
create policy admin_users_select_self on public.admin_users
  for select to authenticated using (user_id = (select auth.uid()));

 drop policy if exists media_assets_public_referenced on public.media_assets;
create policy media_assets_public_referenced on public.media_assets
  for select to anon, authenticated using (
    exists (
      select 1 from public.product_images pi
      join public.products p on p.id = pi.product_id
      join public.categories c on c.id = p.category_id
      where pi.media_asset_id = media_assets.id
        and p.status = 'published'
        and c.is_visible
    )
    or exists (
      select 1 from public.categories c
      where c.cover_media_id = media_assets.id and c.is_visible
    )
    or exists (
      select 1 from public.site_settings s
      where s.hero_media_id = media_assets.id or s.logo_media_id = media_assets.id
    )
  );

 drop policy if exists media_assets_admin_all on public.media_assets;
create policy media_assets_admin_all on public.media_assets
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

 drop policy if exists categories_public_visible on public.categories;
create policy categories_public_visible on public.categories
  for select to anon, authenticated using (is_visible);

 drop policy if exists categories_admin_all on public.categories;
create policy categories_admin_all on public.categories
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

 drop policy if exists products_public_published on public.products;
create policy products_public_published on public.products
  for select to anon, authenticated using (
    status = 'published'
    and exists (
      select 1 from public.categories c
      where c.id = products.category_id and c.is_visible
    )
  );

 drop policy if exists products_admin_all on public.products;
create policy products_admin_all on public.products
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

 drop policy if exists product_images_public_published on public.product_images;
create policy product_images_public_published on public.product_images
  for select to anon, authenticated using (
    exists (
      select 1 from public.products p
      join public.categories c on c.id = p.category_id
      where p.id = product_images.product_id
        and p.status = 'published'
        and c.is_visible
    )
  );

 drop policy if exists product_images_admin_all on public.product_images;
create policy product_images_admin_all on public.product_images
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

 drop policy if exists enquiries_public_insert on public.enquiries;
create policy enquiries_public_insert on public.enquiries
  for insert to anon, authenticated with check (
    status = 'new'
    and email = lower(btrim(email))
    and email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
    and (product_id is null or exists (
      select 1 from public.products p
      where p.id = enquiries.product_id and p.status = 'published'
    ))
  );

 drop policy if exists enquiries_admin_select on public.enquiries;
create policy enquiries_admin_select on public.enquiries
  for select to authenticated using (public.is_admin());

 drop policy if exists enquiries_admin_update on public.enquiries;
create policy enquiries_admin_update on public.enquiries
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

 drop policy if exists enquiries_admin_delete on public.enquiries;
create policy enquiries_admin_delete on public.enquiries
  for delete to authenticated using (public.is_admin());

 drop policy if exists site_settings_public_read on public.site_settings;
create policy site_settings_public_read on public.site_settings
  for select to anon, authenticated using (id);

 drop policy if exists site_settings_admin_all on public.site_settings;
create policy site_settings_admin_all on public.site_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

 drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at before update on public.categories
  for each row execute function public.set_updated_at();

 drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at before update on public.products
  for each row execute function public.set_updated_at();

 drop trigger if exists enquiries_set_updated_at on public.enquiries;
create trigger enquiries_set_updated_at before update on public.enquiries
  for each row execute function public.set_updated_at();

 drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();

revoke all on public.admin_users, public.media_assets, public.categories, public.products,
  public.product_images, public.enquiries, public.site_settings from anon, authenticated;

grant select on public.media_assets, public.categories, public.products,
  public.product_images, public.site_settings to anon, authenticated;
grant insert on public.enquiries to anon, authenticated;
grant select, update, delete on public.enquiries to authenticated;
grant select on public.admin_users to authenticated;
grant insert, update, delete on public.media_assets, public.categories, public.products,
  public.product_images, public.site_settings to authenticated;

insert into public.site_settings (id)
values (true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'art-square-media',
  'ART SQUARE public media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

 drop policy if exists art_square_media_admin_insert on storage.objects;
create policy art_square_media_admin_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'art-square-media' and public.is_admin());

 drop policy if exists art_square_media_admin_update on storage.objects;
create policy art_square_media_admin_update on storage.objects
  for update to authenticated
  using (bucket_id = 'art-square-media' and public.is_admin())
  with check (bucket_id = 'art-square-media' and public.is_admin());

 drop policy if exists art_square_media_admin_delete on storage.objects;
create policy art_square_media_admin_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'art-square-media' and public.is_admin());
