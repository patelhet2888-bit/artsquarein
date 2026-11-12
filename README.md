# ART SQUARE

A responsive, enquiry-first storefront for ART SQUARE, a handmade Indian art and home décor studio. Customers browse a live, published Supabase catalogue, save a session wishlist and contact the business through WhatsApp. Product prices, specifications, stock, shipping terms and online payment are never invented or implied.

## Stack

- Next.js 16 App Router, React 19 and TypeScript
- Tailwind CSS 4 and the ART SQUARE responsive design system
- Supabase Postgres for products, collections, site settings, media records, newsletter subscriptions and enquiries
- Supabase Storage for public storefront media and private reference-image uploads
- Supabase Auth for the protected email-and-password admin dashboard
- Vercel deployment

## Local development

1. Install Node.js 20.9 or later.
2. Install dependencies with `npm install`.
3. Configure the environment variables below in `.env.local` or in the linked Vercel project.
4. Start the development server with `npm run dev` and open `http://localhost:3000`.
5. Run `npm run typecheck`, `npm run lint` and `npm run build` to verify a release.

Product photographs are uploaded and managed from the authenticated Admin → Media and product editor screens. They are stored in Supabase Storage, not in the frontend asset directory.

## Environment variables

| Name | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` or `SUPABASE_URL` | Yes | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes | Public Supabase client key; table and storage access is constrained by RLS. |
| `SUPABASE_SERVICE_ROLE_KEY` | Reference-image uploads | Server-only key used by the private reference-image route. Never expose it to client code. |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical site origin used for metadata and sitemap. |

The Vercel-connected Supabase integration supplies the project credentials. Newsletter and enquiry submissions are reported as successful only after their database inserts succeed.

## Supabase setup

- `20261112000000_create_newsletter_subscribers.sql` creates `public.newsletter_subscribers` with RLS and a restricted anonymous insert policy.
- `20261112000200_create_private_order_reference_bucket.sql` creates the private `art-square-order-references` bucket. The upload route verifies image signatures, caps files at 4 MB and returns a seven-day signed link.
- `20261113000000_create_art_square_catalog_admin.sql` creates the catalogue, media, site settings, enquiry and admin-role tables, their RLS policies, and the public `art-square-media` bucket.
- Admin sign-in uses existing Supabase Auth email/password accounts. Access is granted only to accounts whose user ID is listed in `public.admin_users`; there is no public admin sign-up or hardcoded credential.

The service-role key is used only by the private reference-image upload route and is never returned to the browser. Public catalog reads and authenticated admin changes use the Supabase session and RLS.

## Catalogue and ordering

Published products and visible collections are read from Supabase. Product images, collection covers and storefront branding resolve through Supabase Storage. Admin users can create, edit, publish, archive or delete products; manage collections; upload and describe media; update site settings; and review/update enquiry statuses.

Customers can search and filter the catalog, sort priced products, and send a product-specific WhatsApp enquiry containing its product code and page URL. The site does not take payment. Custom enquiries are stored with the customer’s name, email, country, WhatsApp number, optional product reference and message. The form has no account or address requirement; WhatsApp opens only if the customer chooses to continue there. Wishlist state is kept for the current session only.

## Deployment

Set `NEXT_PUBLIC_SITE_URL` to the canonical domain and deploy through the connected Vercel project. Keep Supabase public and server-only credentials in their correct environments. The site includes per-page metadata, product structured data without fabricated offers, a database-backed sitemap, semantic navigation, responsive images and baseline response security headers.
