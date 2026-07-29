# Demo Integration

`DFATPUNK/personal-website` owns presentation and discovery on `jeremybrunet.com`.

`DFATPUNK/demos` owns the operational demo host at `demos.jeremybrunet.com` and the Vercel rewrites that route visitors to the individual applications.

PR 4 uses internal landing pages on the personal website. It does not reverse-proxy, iframe, migrate, or copy application code from `DFATPUNK/demos`.

## Canonical Routes

| Display name | Personal website route | External demos route | Source repository | Documentation |
| --- | --- | --- | --- | --- |
| MLP — Machine Learning Pipeline Builder | `/demos/mlp` | `https://mlp.jeremybrunet.com/` | `https://github.com/DFATPUNK/mlp` | None |
| Parameter Golf Calculator | `/demos/pg-calculator` | `https://demos.jeremybrunet.com/pg-calculator` | `https://github.com/DFATPUNK/pg-calculator` | `https://writebook.jeremybrunet.com/5/pg-calculator` |
| Zero-Touch Onboarding / Alan | `/demos/alan` | `https://demos.jeremybrunet.com/alan` | `https://github.com/DFATPUNK/hr-onboarding-engine` | `https://writebook.jeremybrunet.com/3/alan.com` |
| Balatro Joker Generator | `/demos/balatro` | `https://demos.jeremybrunet.com/balatro` | `https://github.com/DFATPUNK/balatro-card-generator` | None verified during PR 4 |

The original demos-hub routes returned HTTP 200 during the PR 4 audit on July
21, 2026. MLP was added later as a standalone-hosted live demo.

## Availability

Only Alan and MLP expose live Supabase availability in this version. Their
public registry entries expose a safe logical key only:

```ts
availability: {
  provider: 'supabase',
  key: 'alan',
}
```

Parameter Golf and Balatro do not show database availability indicators.

The browser calls only personal-site API routes:

```txt
GET /api/demos/availability
POST /api/demos/availability/{key}/wake
```

The server calls n8n with server-only values:

```txt
DEMO_STATUS_WEBHOOK_URL
DEMO_HEALTH_WEBHOOK_URL
DEMO_WAKE_WEBHOOK_URL
DEMO_WEBHOOK_SIGNING_SECRET
ALAN_SUPABASE_PROJECT_REF
MLP_SUPABASE_PROJECT_REF
```

Status responses use the normalized states `active`, `waking`, `inactive`, and
`unavailable`, plus `checkedAt` and the logical key. Raw Supabase responses,
project refs, access tokens, anon keys, n8n URLs, and signing secrets are never
sent to the browser.

The website maps only `alan` and `mlp` to server-only project refs. It sends
those refs only from Vercel server routes to signed n8n webhooks using the exact
raw JSON body `{ "ref": "<resolved-ref>" }`. The browser continues to use only
logical keys and can never supply an arbitrary ref.

In n8n, availability uses three Production Webhook workflows backed by the
Supabase Management API:

```txt
DEMO_STATUS_WEBHOOK_URL -> GET https://api.supabase.com/v1/projects/{ref}
DEMO_HEALTH_WEBHOOK_URL -> GET https://api.supabase.com/v1/projects/{ref}/health
DEMO_WAKE_WEBHOOK_URL   -> POST https://api.supabase.com/v1/projects/{ref}/restore
```

The status workflow reads project state first, then calls the Management API
service-health endpoint with the required `services` query parameter before
reporting `active`. Do not report `active` solely from the project-state
response, and do not report `inactive` when the integration cannot determine the
state. Unknown states, malformed responses, timeouts, authentication failures,
or provider failures normalize to `unavailable`.

The availability workflows require only a Supabase Management API token plus
Alan and MLP project refs. Project refs are server-only configuration even
though they are not credentials. They do not require Supabase project URLs,
anon/publishable keys, or direct `/rest/v1/` health checks. Each n8n workflow
must verify the HMAC before using the supplied ref and should additionally
allowlist the two expected refs.

The status route shares successful status data for about 15 seconds. Wake
requests are never cached. When the integration variables are absent or n8n
cannot be reached, Alan and MLP safely render `Unavailable`; launch and source
links remain usable.

The `/demos` index fetches status and refreshes only while a displayed Alan or
MLP status is `waking`; it never calls the wake endpoint. Alan and MLP context
pages may submit one automatic wake request per browser session when a demo is
`inactive`. If that wake request fails, the browser clears its convenience
session guard and shows a discreet `Retry wake-up` control after a short pause.
Retrying is explicit, rate-limited by the UI state, and n8n remains the
authoritative deduplication boundary.

`DEMO_STATUS_WEBHOOK_URL`, `DEMO_HEALTH_WEBHOOK_URL`, and
`DEMO_WAKE_WEBHOOK_URL` must be the active production URLs from the n8n Webhook
triggers. Do not store n8n Test URLs in persistent Vercel configuration.
Signing-secret values must match between n8n and Vercel, and Vercel
environment-variable changes apply only after a new deployment.

## Observed Route Discrepancy

The `DFATPUNK/demos` UI currently links two demos with descriptive local paths:

- `/zero-touch-onboarding` for Zero-Touch Onboarding;
- `/balatro-joker-generator` for Balatro Joker Generator.

The same repository's `vercel.json` uses the operational rewrite paths:

- `/alan`;
- `/balatro`;
- `/pg-calculator`.

For PR 4, the personal website treats the Vercel rewrite configuration and successful live-route verification as the source of truth. The canonical personal-site slugs are `alan`, `balatro`, and `pg-calculator`.

No compatibility redirects were added because there is no evidence that `jeremybrunet.com/demos/zero-touch-onboarding` or `jeremybrunet.com/demos/balatro-joker-generator` previously existed.

## Ownership Boundaries

The personal website is responsible for:

- the `/demos` catalog;
- stable internal landing pages under `/demos/[slug]`;
- concise editorial context;
- links to live applications, repositories, and verified manuals;
- local typed metadata and validation.

The demos repository is responsible for:

- `demos.jeremybrunet.com`;
- Vercel rewrites for the hosted applications;
- application source, APIs, assets, and deployment behavior;
- any future repair of old UI paths.

PR 4 does not require modifying `DFATPUNK/demos`.

## Landing Page Decision

Each personal-site demo route is an internal landing page. The page gives context, lists topics, and links to the externally hosted live application.

This keeps `jeremybrunet.com` responsible for presentation while `demos.jeremybrunet.com` remains responsible for application hosting.

The release deliberately does not:

- reverse-proxy demo applications;
- embed applications in iframes;
- migrate demo source code into the personal website;
- copy application APIs;
- add cross-project Vercel rewrites;
- change DNS or subdomains.

The demos index describes demos and contexts publicly. It notes that some demos
may need a short warm-up without claiming every demo uses an on-demand database
or exposing a fake dynamic availability indicator.

## Adding A Future Demo

Future public demos should be added by editing the typed registry in `lib/content/demos.ts`.

Before adding a live entry:

1. Verify the public external route.
2. Choose one URL-safe canonical slug.
3. Use exactly one destination field:
   - `externalPath` for applications on `https://demos.jeremybrunet.com`;
   - `externalUrl` for applications on another validated HTTP/HTTPS host.
4. Add verified repository and documentation URLs only when available.
5. Use only registered topic tags.
6. Add or update focused registry tests when the route set changes.

Adding a future `/demos/mlp` page should require a registry entry, not a layout rewrite.

Live links continue to use `DemoLaunchAction`, which hides the launch link below
the `lg` breakpoint and keeps source repository links available on mobile.

## MLP Entry

MLP is published as `/demos/mlp` with `externalUrl:
https://mlp.jeremybrunet.com/` because it is not hosted on the demos hub.
The personal website does not iframe, proxy, migrate, or modify the external
MLP application.
