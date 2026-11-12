# ART SQUARE

A responsive, enquiry-first storefront for ART SQUARE, a handmade Indian art and home décor studio. Customers can browse eight collections and 25 catalogue entries with all 32 original product photographs, save a wishlist, build an enquiry bag, and contact the business through WhatsApp. Prices, stock, shipping terms and online payment are not invented or implied.

## Stack

- Next.js 16 App Router, React 19 and TypeScript
- Tailwind CSS 4 and the ART SQUARE responsive design system
- Lucide React
- Supabase Postgres for newsletter subscriptions and private Storage for reference images
- Vercel deployment

## Local development

1. Install Node.js 20.9 or later.
2. Install dependencies with `npm install`.
3. Configure the environment variables below in `.env.local` or in the linked Vercel project.
4. Start the development server with `npm run dev` and open `http://localhost:3000`.
5. Run `npm run typecheck`, `npm run lint` and `npm run build` to verify a release.

Run `npm run images:optimize` to regenerate the 32 WebP assets from the original JPEGs in the repository root. The script leaves every source JPEG untouched and writes descriptive files to `public/images/products/`.

## Environment variables

| Name | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Newsletter | Supabase URL for the public newsletter form. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Newsletter | Public client key; newsletter access is constrained by RLS. |
| `SUPABASE_URL` | Reference-image uploads | Server-side Supabase URL. |
| `SUPABASE_SERVICE_ROLE_KEY` | Reference-image uploads | Server-only key used by the upload route. Never expose it to client code. |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical site origin used for metadata and sitemap. |
| `NEXT_PUBLIC_BUSINESS_EMAIL` | Optional | Public contact email shown only when configured. |

The Vercel-connected Supabase integration supplies the database and storage variables. Newsletter submissions are reported as successful only after a database insert succeeds.

## Supabase setup

- `20261112000000_create_newsletter_subscribers.sql` creates `public.newsletter_subscribers` with RLS and a restricted anonymous insert policy.
- `20261112000200_create_private_order_reference_bucket.sql` creates the private `art-square-order-references` bucket. The bucket allows JPEG, PNG and WebP files up to 5 MB. The form caps uploads at 4 MB to stay within typical serverless request limits, verifies file signatures, and creates a seven-day signed link. Uploaded objects remain private until an operator removes them; the current site does not retain the rest of the custom-order form fields.
- The service-role key is used only in the server route and never returned to the browser.

Product and collection information is centrally maintained in `lib/products.ts`. No customer account or admin product editor is enabled.

## Catalogue and ordering

The 32 original source JPEGs are preserved at the repository root. The image-optimization script generates 32 descriptive WebP versions, and `lib/products.ts` maps each source photograph into a product gallery. Product IDs and visual descriptions are provided; prices, material specifications, dimensions and variant availability remain unset unless verified.

The enquiry bag and wishlist use in-memory client state and clear on a full page refresh. WhatsApp is the checkout handoff; the site does not collect payment or claim that a message was sent until the customer sends it in WhatsApp. Business WhatsApp: +91 90549 34190. Instagram: [@art_square_in](https://www.instagram.com/art_square_in/).

## Deployment

Set `NEXT_PUBLIC_SITE_URL` to the canonical domain, optionally set `NEXT_PUBLIC_BUSINESS_EMAIL`, and deploy through the connected Vercel project. Keep Supabase public and server-only credentials in their correct environments. The site includes per-page metadata, product structured data without fabricated offers, sitemap and robots routes, semantic navigation, responsive images and baseline response security headers.
