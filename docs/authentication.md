# Magic links and business entry

Lealcito has a single identity and session per user; the session does not include a business or role. The `/b/:slug` view is public. “Enter” records the person's decision for each business in `business_customers`, without granting a membership or privileges. Private routes check `business_staff` or `business_memberships` on every request. Actual promotions are not displayed yet, and purchases are not recorded.

## Configuration

- `RESEND_API_KEY`: Resend secret.
- `MAILER_FROM=Lealcito <no-reply@lealcito.app>`: domain verified in Resend.
- `APP_ORIGIN`: the application's public origin, **required in all environments**. In `.dev.vars`: `APP_ORIGIN=http://localhost:5173` (adjust to the host/port in use). In production: `https://lealcito.app`. Configure it separately in production and staging (for example, `wrangler secret put APP_ORIGIN` and `wrangler secret put APP_ORIGIN --env stg`), using each environment's actual HTTPS URL. Links are not built from the request's Host header.
- `LEADS_TO` is used for landing page leads and is not used here.

Do not copy secrets into the repository. Before deploying, verify the sender domain, secrets, and URL for each environment. The `business_customers` migrations and the customer backfill for existing memberships were generated with Drizzle Kit; apply them to D1 with `bun run db:migrate:local`. Do not apply them to staging or production without reviewing them first.

## Flow

From `/b/:slug/login`, the user submits their email through a React Router form. A random 256-bit token is generated, and only its SHA-256 hash is stored in `magic_link_requests`, together with the normalized email, slug, and expiration (15 minutes). Requests are limited to three links per email address every fifteen minutes. The response does not reveal whether the email already had an account or whether the request was rate-limited.

Opening `/auth/confirm?token=...` only displays the confirmation button; **the POST request** consumes the link through an atomic conditional update (unexpired, unused). After verifying the email, a `users` record is created or reused, and a 30-day session is issued in `sessions` with a hashed token and an `HttpOnly`, `SameSite=Lax`, host-only cookie that uses `Secure` over HTTPS. Logging out via POST revokes the session in D1. The return destination is resolved in the database, and an arbitrary destination from the browser is never accepted. Confirmation responses prevent caching and suppress `Referer` to protect the token in the URL.

Link and session expiration times are stored as UTC instants (milliseconds since the epoch) and compared with the current instant, regardless of the server's or user's time zone. Dates displayed in Argentina use `America/Argentina/Buenos_Aires`; business-specific calendar rules, when implemented, will use `businesses.timezone`.

Owner assignment (`business_staff.role = admin`) remains manual. Anyone can verify their address and create an account, but the magic link does not grant any role or membership. After confirming the link, they return to `/b/:slug` and click “Enter” to explicitly record their entry (existing members are considered to have already entered). Owners and staff access the business with their role without needing to enter as customers; they can click “Enter as a customer” separately.

## Per-business private access

- `/b/:slug/benefits` requires a session and an **active** `business_memberships` row for that user and business. It reads only that customer's granted benefits for the current instant (`period_start <= now < period_end`); a suspended membership or an entry alone is insufficient.
- `/b/:slug/staff` requires `business_staff.role` to be `staff` or `admin` for that business.
- `/b/:slug/manage` requires `business_staff.role = admin` for that business. Being staff or an owner does not automatically grant customer benefits.

These routes read current permissions from D1 on every request, even if a browser already shows a link. The staff and owner pages are minimal authorization checks; they do not yet implement redemptions or business configuration. Unknown businesses return 404, and unauthorized access returns 403. Logging out revokes access to all three routes.

## Local verification

1. Run `bun run db:status:local`; apply pending migrations locally only.
2. Create two test businesses in local D1 and visit `/b/<slug>` using `bun --bun run dev` (or `bun --bun run build && bun --bun run preview`). Without a session, “Enter” redirects to the email form.
3. Test the email form with Resend configured for your own email address; open the link and confirm sign-in. Return to the business, register entry, and check that the page shows the no-membership state; the second business should still prompt the user to enter. Verify that repeating the POST does not create another entry and that logging out deletes the session, not the entries. With local fixtures, check that active customers see only their own current benefits in their business, suspended customers cannot access benefits, staff cannot access `/manage`, and changing the slug denies access outside one's assigned business.
4. Run `bun test tests/auth-token.test.ts tests/business-entry.test.ts`, `bun --bun run typecheck`, and `bun --bun run build`. The `bun run typecheck` script may fail before TypeScript runs if `react-router typegen` uses Node earlier than 22.22; with this installation, it works when run through Bun.

Per-email-address protection is the initial limit; **there is no IP-based protection yet**, nor an email retry queue. Additional edge-level protection (Cloudflare) will be needed before publicly enabling a large volume of requests.
