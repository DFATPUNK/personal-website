# n8n Demo Availability Workflows

This document describes the external workflow contract for Alan and MLP demo
availability. No real project refs, tokens, webhook URLs, or secrets belong in
Git.

## Website Contract

The website exposes:

```txt
GET /api/demos/availability
POST /api/demos/availability/{key}/wake
```

The browser never calls n8n or the Supabase Management API directly. It also
never sends or chooses a Supabase project ref. The personal-site server resolves
only these logical keys:

```txt
alan -> ALAN_SUPABASE_PROJECT_REF
mlp  -> MLP_SUPABASE_PROJECT_REF
```

The website calls three n8n Production Webhook workflows with server-only
values:

```txt
DEMO_STATUS_WEBHOOK_URL
DEMO_HEALTH_WEBHOOK_URL
DEMO_WAKE_WEBHOOK_URL
DEMO_WEBHOOK_SIGNING_SECRET
ALAN_SUPABASE_PROJECT_REF
MLP_SUPABASE_PROJECT_REF
```

Meanings:

```txt
DEMO_STATUS_WEBHOOK_URL
    n8n Production Webhook URL that proxies GET /v1/projects/{ref}

DEMO_HEALTH_WEBHOOK_URL
    n8n Production Webhook URL that proxies GET /v1/projects/{ref}/health

DEMO_WAKE_WEBHOOK_URL
    n8n Production Webhook URL that proxies POST /v1/projects/{ref}/restore
```

Do not use n8n Test URLs for persistent Vercel configuration. Vercel
environment-variable changes apply only after a new deployment.

## Signed Requests

Each website-to-n8n request sends the exact raw JSON body:

```json
{
  "ref": "abcdefghijklmnopqrst"
}
```

Requests include:

```txt
x-jeremy-timestamp: ISO timestamp
x-jeremy-signature: HMAC SHA-256 hex digest
```

The signature payload is:

```txt
{timestamp}.{exact_raw_body}
```

n8n must recompute the signature with the shared secret and compare the hex
digests with a constant-time comparison. Reject missing, malformed, or old
timestamps; use a short validity window, such as five minutes. Each workflow
must verify the HMAC before using the supplied project ref.

## n8n Secrets And Credentials

The n8n instance holds the Supabase Management token, signing secret, and an
allowlist of the two expected refs:

```txt
SUPABASE_MANAGEMENT_TOKEN
ALAN_SUPABASE_PROJECT_REF
MLP_SUPABASE_PROJECT_REF
DEMO_WEBHOOK_SIGNING_SECRET
```

The Supabase Management API access token must never be stored in Vercel, Git,
browser code, or any `NEXT_PUBLIC_*` variable. Project refs are not credentials,
but they are server-only configuration. They are sent only from Vercel server
routes to signed n8n webhooks. n8n should additionally allowlist the two
expected refs before calling Supabase.

Alan and MLP Supabase project URLs, anon keys, publishable keys, and direct
`/rest/v1/` health checks are not required for this availability workflow.

## Supabase Management API Calls

All Supabase Management API requests use:

```txt
Authorization: Bearer <SUPABASE_MANAGEMENT_TOKEN>
Content-Type: application/json
```

The Management token stays in n8n only.

Read project state:

```txt
GET https://api.supabase.com/v1/projects/{ref}
```

Required fine-grained permission:

```txt
project_admin_read
```

Use the returned project `status` to identify clearly inactive or paused
projects.

Read service health:

```txt
GET https://api.supabase.com/v1/projects/{ref}/health
```

Required fine-grained permission:

```txt
project_admin_read
```

The official endpoint requires the `services` query parameter and optionally
accepts `timeout_ms`. Do not hard-code an unverified enum list in the workflow
documentation or implementation notes. Select the required service values from
the current Supabase API reference or the observed n8n request result. For this
site, the health decision must include the database/data API service required by
the demos.

The health response is an array of service records including fields such as:

- `name`;
- `healthy`;
- `status`;
- optional `info`;
- optional `error`.

Restore a paused project:

```txt
POST https://api.supabase.com/v1/projects/{ref}/restore
```

Required fine-grained permission:

```txt
project_admin_write
```

Successful response:

```json
{}
```

Do not confuse this project-resume endpoint with PITR backup restore, database
backup restore, or `GET /v1/projects/{ref}/restore`, which lists available
restore versions.

## Project-State Webhook

Input:

```json
{
  "ref": "abcdefghijklmnopqrst"
}
```

Expected successful response:

```json
{
  "ref": "abcdefghijklmnopqrst",
  "status": "INACTIVE"
}
```

The response may include other Supabase project fields, but the website selects
only `ref` and `status`. The returned `ref` must equal the requested ref.

Normalization:

- `INACTIVE` -> `inactive`;
- `ACTIVE_HEALTHY` -> call the health webhook;
- any other non-empty provider status -> call the health webhook rather than
  guessing that it is active;
- missing config, malformed response, returned-ref mismatch, timeout,
  authentication failure, or provider failure -> `unavailable`.

Do not expose the raw project status publicly.

## Service-Health Webhook

Call this only when the project-state result is not `INACTIVE`.

Input:

```json
{
  "ref": "abcdefghijklmnopqrst"
}
```

Expected successful response: a bounded array of service-health records:

```json
[
  {
    "name": "auth",
    "healthy": true,
    "status": "COMING_UP"
  }
]
```

The website validates records with a non-empty `name`, boolean `healthy`, and
optional string `status`.

Normalization:

- non-empty array and every returned required service has `healthy: true` ->
  `active`;
- valid response with at least one `healthy: false` -> `waking`;
- empty array, malformed response, timeout, authentication failure, or provider
  failure -> `unavailable`.

Do not expose the raw health array publicly.

## Status Orchestration

For each managed demo key:

1. Resolve its server-only project ref.
2. Call `DEMO_STATUS_WEBHOOK_URL` with `{ "ref": ref }`.
3. If project status is `INACTIVE`, return `inactive`.
4. Otherwise call `DEMO_HEALTH_WEBHOOK_URL` with `{ "ref": ref }`.
5. Return logical key, normalized state, and `checkedAt` only.

Alan and MLP are fetched independently and in parallel when practical. A failure
for one project must not force the other project to `unavailable`. The website
caches only normalized safe state and timestamps for a short window.

Do not report `active` solely because `GET /v1/projects/{ref}` returns an
active-looking status. Do not report `inactive` when the integration cannot
determine the state.

## Wake Webhook

The website wake route accepts only the logical key in the URL. It never accepts
a browser-supplied project ref.

Input:

```json
{
  "ref": "abcdefghijklmnopqrst"
}
```

Supabase's successful project-restore response is:

```json
{}
```

Treat an HTTP 2xx response with a valid empty JSON object as an accepted wake
request. The website normalizes it to the existing public contract:

```json
{
  "ok": true,
  "key": "alan",
  "state": "waking"
}
```

The public response uses the logical key, never the project ref. After an
accepted wake, the website clears its short status cache and lets later status
checks detect service-health readiness.

The n8n wake workflow remains responsible for authoritative deduplication before
calling Supabase restore. It must validate HMAC and timestamp, check that the
supplied ref is allowlisted, read current project state, avoid duplicate restore
calls during a recent wake operation, and call
`POST /v1/projects/{ref}/restore` only when the project is inactive. If the
current wake workflow calls Supabase restore unconditionally, update it to read
project state and deduplicate before restore.

Set provider timeouts and bounded retries conservatively. Respect the Supabase
Management API rate limit and rely on the website's brief status cache plus n8n
Data Table deduplication to reduce request volume.

## Optional Preventive Activity

A separate scheduled n8n workflow may run the same Management API state and
service-health checks once or twice per day and update the n8n Data Table cache.
This is preventive only. The website routes must function safely without it.
Do not introduce Supabase project URLs or anon/publishable keys for this
availability workflow without a separate review.
