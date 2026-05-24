<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into svelte.rocks. Below is a summary of all changes made.

## Summary of changes

### New files created

- **`src/hooks.client.ts`** — Initializes PostHog using `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` env vars via the `init()` hook (runs once before the app loads). Also exports a `handleError` hook to capture client-side exceptions automatically via `posthog.captureException()`. Routing PostHog ingestion through `/ingest` to avoid ad blockers.
- **`src/lib/server/posthog.ts`** — Server-side PostHog singleton using `posthog-node`. Used by all server actions to track backend events with `flushAt: 1` for edge-compatible flushing (compatible with Cloudflare Workers).

### Modified files

- **`svelte.config.js`** — Added `paths.relative: false` (required for session replay to work correctly with SSR).
- **`src/hooks.server.ts`** — Added reverse proxy routing `/ingest/*` to `eu.i.posthog.com` (avoids ad blockers). Added `handleError` to capture server-side errors via `posthog-node`.
- **`src/routes/+layout.ts`** — Removed PostHog initialization (moved to `hooks.client.ts`). PostHog is now initialized earlier in the lifecycle before routes load.
- **`src/routes/+layout.server.ts`** — Removed PostHog key passing (keys are now read directly from `PUBLIC_*` env vars).
- **`src/routes/(auth)/login/+page.server.ts`** — Added `user_logged_in` server-side event after successful authentication.
- **`src/routes/(auth)/login/+page.svelte`** — Added `posthog.identify()` on login success to correlate the client session with the authenticated user.
- **`src/routes/(auth)/register/+page.server.ts`** — Added `user_signed_up` server-side event after successful account creation.
- **`src/routes/(auth)/register/+page.svelte`** — Added `posthog.identify()` on registration success.
- **`src/lib/components/nav-user.svelte`** — Added `user_logged_out` capture before the existing `posthog.reset()` call on logout.
- **`src/routes/(app)/feedback/+page.server.ts`** — Added `feedback_submitted` event when feedback is successfully saved.
- **`src/routes/(app)/settings/delete-account/+page.server.ts`** — Added `account_deleted` event before the account is deleted (critical churn signal).
- **`src/routes/(app)/settings/email/+page.server.ts`** — Added `email_change_requested` event with the new email as a property.
- **`src/routes/(app)/settings/password/+page.server.ts`** — Added `password_changed` event after successful password update.

### Environment variables added

- `PUBLIC_POSTHOG_KEY` — PostHog project token (public, used by client and server)
- `PUBLIC_POSTHOG_HOST` — PostHog host URL (`https://eu.i.posthog.com`)

### Package installed

- `posthog-node` — Server-side PostHog SDK for tracking events from SvelteKit server actions and API routes.

## Events instrumented

| Event name               | Description                               | File                                                       |
| ------------------------ | ----------------------------------------- | ---------------------------------------------------------- |
| `user_logged_in`         | User successfully authenticates           | `src/routes/(auth)/login/+page.server.ts`                  |
| `user_signed_up`         | User creates a new account                | `src/routes/(auth)/register/+page.server.ts`               |
| `user_logged_out`        | User logs out                             | `src/lib/components/nav-user.svelte`                       |
| `feedback_submitted`     | User submits product feedback             | `src/routes/(app)/feedback/+page.server.ts`                |
| `account_deleted`        | User permanently deletes their account    | `src/routes/(app)/settings/delete-account/+page.server.ts` |
| `email_change_requested` | User requests an email address change     | `src/routes/(app)/settings/email/+page.server.ts`          |
| `password_changed`       | User successfully changes their password  | `src/routes/(app)/settings/password/+page.server.ts`       |
| `posthog.identify()`     | Client-side identity link on login        | `src/routes/(auth)/login/+page.svelte`                     |
| `posthog.identify()`     | Client-side identity link on registration | `src/routes/(auth)/register/+page.svelte`                  |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/701908)
- [New signups over time](/insights/3uLGSoM6)
- [Daily logins](/insights/i1e6jSaT)
- [Signup to login conversion funnel](/insights/rIbIQFHo)
- [Account deletions (churn)](/insights/bEbs4cOj)
- [Feedback submissions](/insights/8oGqrno6)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
