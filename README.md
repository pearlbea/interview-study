# Interview Study

A Next.js app for technical interview flashcards. The current shell supports
Supabase email/password authentication; study features are not yet implemented.
Google sign-in is deferred and is not shown in the app.

## Set up authentication

1. Create a [Supabase project](https://supabase.com/dashboard). Copy
   `.env.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL` and
   `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from the project's Connect dialog.
   The publishable key is public; do not put a secret or service-role key here.
2. Set `NEXT_PUBLIC_SITE_URL` to the app's origin, for example
   `http://localhost:3000`. Use the actual HTTPS origin in production.
3. In Supabase Authentication settings, enable sign-ups, the Email provider,
   and email confirmation. Under URL Configuration, set the Site URL to the
   app origin, for example `http://localhost:3000` for local development.
   Add `http://localhost:3000/auth/callback` to the Redirect URLs list; also
   add the equivalent production callback URL when deploying.
4. Leave the default Confirm signup email template unchanged. Supabase's
   default email service is rate-limited and sends only to authorized team
   addresses; configure a custom SMTP provider for production.

For more details, see the Supabase guides for
[server-side auth](https://supabase.com/docs/guides/auth/server-side/nextjs).

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Create an account and
open the confirmation link in the same browser and device used to sign up.
Then sign out and sign back in to verify the flow. Starting another sign-up
before opening the link can invalidate the verifier, so use the latest email.
The Supabase project and redirect URL must be configured before this will work.

```bash
npm run lint
npm run build
```

Session cookies are refreshed in the Next.js proxy, and the home page verifies
claims on the server. Future protected pages, server actions, and database
policies must independently verify authentication and authorization. Admin
roles, password recovery, and study data have not been implemented yet.
