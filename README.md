# ART SQUARE

A premium, responsive storefront for ART SQUARE, a handmade Indian art and home décor studio. The site is enquiry-first: product discovery and detail pages lead to WhatsApp, with no cart, online checkout, payment gateway, stated prices or unverified stock and shipping claims.

## Stack

- Next.js App Router and TypeScript
- Tailwind CSS 4 and custom responsive design system
- Framer Motion (available for interaction and motion work) and Lucide React
- Supabase Postgres for newsletter sign-ups
- Vercel deployment

## Local development

1. Install Node.js 20.9 or later.
2. Install dependencies with `npm install`.
3. Create `.env.local` from the variables below, or configure the same names in your Vercel project.
4. Start the development server with `npm run dev` and open `http://localhost:3000`.
5. Run `npm run typecheck` and `npm run build` to verify a release.

## Environment variables

| Name | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Newsletter sign-ups | Connected Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Newsletter sign-ups | Public Supabase client key; table access is constrained by RLS. Never use a service-role key in browser code. |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical site origin used for metadata and sitemap, e.g. `https://your-domain.example`. |

Supabase environment values are available to the Vercel-connected project. The app reports a newsletter error if Supabase configuration or the database is unavailable; it does not claim a sign-up succeeded unless the database insert succeeds.

## Supabase setup

The `supabase/migrations/20261112000000_create_newsletter_subscribers.sql` migration creates `public.newsletter_subscribers` with a unique, length-checked email, and enables RLS. Anonymous users may only insert normalized, format-checked addresses. There is no public read, update or delete policy. This migration is also applied to the Supabase integration connected to this project.

The optional product admin dashboard is not enabled: product details remain in `lib/products.ts` and there is no admin login, product editing API or image-upload surface to secure. Do not add admin routes without implementing Supabase Auth and admin-only RLS policies first.

## Products and photographs

The original uploaded photographs remain preserved in the repository root. Selected originals are copied into `public/products/` for optimized, local storefront delivery. `lib/products.ts` is the editable catalogue and includes product IDs, slugs, categories, descriptions, photographs, material/dimension enquiry labels, customization flags, availability enquiry status and featured status. Prices and variants are left unset where not supplied.

## Ordering and contact

The shared floating WhatsApp action and product-specific enquiry links use `+91 90549 34190`. The custom-order form validates the required fields and prepares a prefilled WhatsApp message. The visitor reviews and sends that message; the site never reports that an enquiry was delivered before the visitor submits it in WhatsApp. Instagram: [@art_square_in](https://www.instagram.com/art_square_in/).

## Deployment

Connect the repository to Vercel, keep the Supabase public environment variables configured for the Production and Preview environments, set `NEXT_PUBLIC_SITE_URL` to the canonical domain, and deploy. The application includes generated sitemap and robots routes, product metadata and JSON-LD, responsive image sizes, semantic navigation and baseline response security headers.
