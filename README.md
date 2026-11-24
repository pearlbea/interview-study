# Interview Study

A Next.js app for technical interview flashcards with Supabase email/password
authentication, a topic-based quiz, and an admin section for questions.
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

Session cookies are refreshed in the Next.js proxy. Protected pages, server
actions, and database policies must independently verify authentication and
authorization. Password recovery has not been implemented yet.

## Administer questions

1. Apply `supabase/migrations/20261123181000_admin_cards.sql` after the initial
   schema migration using the Supabase migration workflow or SQL editor.
2. Create and confirm an account, then find its user ID in Supabase
   Authentication. In the SQL editor, run the following with that UUID:

   ```sql
   insert into public.admin_users (user_id)
   values ('YOUR-USER-UUID')
   on conflict do nothing;
   ```

3. Sign in with that account and open `/admin` (also linked from the topic
   picker). An admin can create, edit, publish, and remove questions, and select
   one or more topics. Questions support Markdown, including fenced code blocks;
   the quiz renders Markdown without raw HTML.

Removing a question permanently deletes it only if it has no reviews or
schedule. Otherwise, it is archived to preserve study history. Archived
questions can be edited and republished. Admin access is checked by both the
server and database; grant or revoke it through trusted database access, not
through user-editable metadata. To revoke access, delete the account's row from
`public.admin_users` in the SQL editor.

## Database schema

The initial migration is in `supabase/migrations`. It has not been applied
automatically. Use the [Supabase CLI migration workflow](https://supabase.com/docs/guides/deployment/database-migrations)
to test it locally and, once reviewed, apply it to the linked project.
The SQL checks in `supabase/checks/initial_study_schema.sql` and
`supabase/checks/admin_cards.sql` can be run with `psql -v ON_ERROR_STOP=1 -f`
against an isolated test database after applying all migrations. They roll
back their data.

- Cards store Markdown for questions, answers, and optional additional detail.
  The quiz currently renders Markdown in questions; answers and additional
  detail are displayed as text.
- Cards can have multiple topics and ordered reference links. Draft and archived
  cards are not visible to signed-in users; published cards are read-only.
- Each user's `card_schedules` row contains FSRS scheduling state; a missing
  row means the card is new to that user. `reviews` records ratings 1–4
  (Again, Hard, Good, Easy) for scheduled reviews and study-ahead practice.
  Schedule state 0–3 means New, Learning, Review, or Relearning respectively.
  Only scheduled reviews should update FSRS state; practice does not.
- Row-level security isolates each user's schedule and review history. Ordinary
  users cannot write card content or see drafts; admin changes use database
  functions that verify admin membership and save cards and topics atomically.

The schema stores scheduling data but does not calculate FSRS intervals.
The future review flow must write the review and updated schedule atomically,
handle concurrent reviews, and keep practice from changing the schedule.
Anki import is not implemented yet.
