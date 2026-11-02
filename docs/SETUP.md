# Setup · Compiled By SOC v34

Use office-owned provider projects and named executive accounts. Application secrets belong in server environment variables, never public variables or source control.

## Database and email codes

1. Create a Supabase project. For a fresh database, apply `supabase/migrations/001_platform.sql`, then `002_admin_content_finance.sql`, once each in order. To upgrade an existing v33 database, back it up and apply only `002` once. These are migrations, not reset scripts.
2. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. A legacy anon key can occupy the publishable-key variable. Set `SUPABASE_SERVICE_ROLE_KEY` separately: it is server-only and needed for creating executive accounts and processing guest payments. The service key bypasses row-level permissions and must never be exposed to a browser.
3. Enable email sign-in. Set the Auth Site URL to the deployed origin and configure production SMTP. In Authentication → Email Templates → Magic Link, include `{{ .Token }}` so the student/staff can type a code. Example:

   ```html
   <h2>Your Compiled By SOC code</h2>
   <p>Enter <strong>{{ .Token }}</strong> to continue.</p>
   <p>If you did not request this, ignore this message.</p>
   ```

   There is no magic-link callback route. The app accepts 6–10 digit codes. Test delivery to your real student email domains and keep OTP rate limits enabled. If the provider uses a separate confirmation email for a newly created user, give it the same token-based template.
4. Bootstrap the first administrator: open `/vote-access` using the intended owner's email and verify its code once. This creates an unprivileged identity, not an administrator. In the Supabase SQL Editor, substitute that exact verified email:

   ```sql
   update public.profiles p
   set role = 'admin', active = true
   from auth.users u
   where p.id = u.id
     and lower(u.email) = lower('replace-with-owner@example.com')
     and u.email_confirmed_at is not null
   returning p.id, p.role;
   ```

   Confirm exactly one intended row changed. Then open `/admin`.
5. Use `/admin/staff` to create other executives by email/name and select their areas. No password or student-style signup is needed. Share the `/staff/sign-in` URL through your normal channel; account creation itself sends no invitation. Only owners can appoint staff. To change your own privileges, use another administrator. Keep a second trusted administrator for continuity.

Area mapping: content covers general pages, posts and calendar; academics covers academic/resource pages; finance covers payment items, records and the dues page; community covers community/welfare pages; elections covers election operations; settings covers the shared header/footer/navigation. Full administrator grants all areas and staff management. Older editor/election-officer roles retain their respective scope until changed through the staff screen.

## R2 media

1. Create a private R2 bucket with public access disabled.
2. Create a bucket-scoped read/write credential. Set `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` and `R2_BUCKET`.
3. Set `APP_URL` to the exact app origin, with no trailing slash; for local development use `http://localhost:3000`.
4. Upload a JPG, PNG, WebP or PDF in the permitted admin area. Publish a test image/document, then unpublish it and confirm signed-out access disappears. Issued signed read links can remain valid for up to 60 seconds.

Uploads use the authenticated server handler, so bucket CORS is unnecessary. The limit is 4 MB. File signatures and MIME types are checked; SVG/HTML are rejected. PDFs download as attachments. Unpublished media is visible to authorised staff in that area; referenced published content is public. Uploaded files are not antivirus scanned. Review unused objects before deleting them.

## Paystack

1. Use a Paystack test secret in server-only `PAYSTACK_SECRET_KEY` (starts `sk_test_`). No public Paystack key is required by this hosted-checkout implementation.
2. In Paystack, configure webhook URL `https://your-app-origin/api/payments/webhook`. Use the same environment and secret as the application.
3. In `/admin/finance`, create an item, enter its amount in naira and academic session, then activate it. The server snapshots the amount in kobo when preparing checkout.
4. Complete the test flow in `FINANCE.md`: successful/failed payments, callback refresh, webhook delivery, receipts and exports. Test payments must remain labelled TEST and excluded from live money totals.
5. Only after verifying the chosen merchant account and live settings, replace the secret with its live key, configure the live webhook and redeploy. Use a separate staging project for test transactions where possible. The app sends its callback URL on initialization; a callback visit alone is never proof of payment.

## Vercel deployment

1. Put this application source in the office repository; exclude `.env.local`, `node_modules`, `.next` and temporary files.
2. Import into Vercel with Next.js, Node 24, `npm ci` and `npm run build`. Leave the output directory at its default; never choose `dist`.
3. Add every needed environment variable from `.env.example`. Match `APP_URL` to the actual deployed origin; use deliberate separate origins/settings for previews.
4. Keep `ELECTION_VOTING_ENABLED=false` until the election rehearsal passes. The database voting gate also starts disabled.
5. Test mobile/desktop views, admin editing, account scopes, email codes, a file upload and test payment against the real services. The source archive has passed build and local database tests, not these live-provider checks.
6. Review sample content through the admin. The app currently discourages search indexing; adjust `robots` in `app/layout.tsx` after content approval.

## Provider documentation

- https://paystack.com/docs/payments/accept-payments/
- https://paystack.com/docs/payments/verify-payments/
- https://paystack.com/docs/payments/webhooks/
- https://supabase.com/docs/reference/javascript/auth-admin-createuser
- https://supabase.com/docs/guides/auth/server-side/creating-a-client
- https://developers.cloudflare.com/r2/examples/aws/aws-sdk-js-v3/
- https://nextjs.org/docs/app/getting-started/installation
