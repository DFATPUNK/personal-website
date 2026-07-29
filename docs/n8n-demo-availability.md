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

The browser never calls n8n or the Supabase Management API directly. The
personal-site server calls n8n with:

```txt
DEMO_STATUS_WEBHOOK_URL
DEMO_WAKE_WEBHOOK_URL
DEMO_WEBHOOK_SIGNING_SECRET
```

Requests include:

```txt
x-jeremy-timestamp: ISO timestamp
x-jeremy-signature: HMAC SHA-256 hex digest
```

The signature payload is:

```txt
{timestamp}.{raw_request_body}
```

n8n must recompute the signature with the shared secret and compare the hex
digests with a constant-time comparison. Reject missing, malformed, or old
timestamps; use a short validity window, such as five minutes.

## n8n Secrets And Credentials

The n8n instance holds:

```txt
SUPABASE_MANAGEMENT_TOKEN
ALAN_SUPABASE_PROJECT_REF
MLP_SUPABASE_PROJECT_REF
DEMO_WEBHOOK_SIGNING_SECRET
```

The Supabase Management API access token must never be stored in Vercel or the
browser when n8n is the privileged boundary. It must never be stored in Git or
in any `NEXT_PUBLIC_*` variable.

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

## Status Lookup Workflow

For each allowlisted key, `alan` and `mlp`:

1. Validate HMAC and timestamp.
2. Map `alan` or `mlp` to the corresponding Supabase project ref.
3. Read a short-lived cached state from an n8n Data Table when available.
4. Query `GET /v1/projects/{ref}` from the Supabase Management API when stale.
5. Normalize the project state:
   - project status clearly inactive or paused -> `inactive`;
   - project status indicates creation, restoration, or startup -> `waking`;
   - project appears active -> call `GET /v1/projects/{ref}/health`;
   - unknown status, malformed response, timeout, authentication failure, or
     provider failure -> `unavailable`.
6. Call `GET /v1/projects/{ref}/health` with the required `services` query
   parameter before reporting `active`.
7. Return `active` only when the required services are healthy.
8. Return `waking` when a recent deduplicated wake exists but health is not
   ready.
9. Return `unavailable` for unknown health states, timeouts, malformed
   responses, authentication failures, or provider errors.
10. Cache only normalized safe state and timestamps.

Public responses must contain only logical keys, normalized states, and
`checkedAt`. Do not expose raw Supabase payloads.

Supabase notes that recently restored services can take a couple of minutes to
become fully operational. The Management API service-health response remains
authoritative before reporting `active`. Do not report `active` solely because
`GET /v1/projects/{ref}` returns an active-looking status. Do not report
`inactive` when the integration cannot determine the state.

## Wake Workflow

1. Validate HMAC, timestamp, and allowlisted key.
2. Map `alan` or `mlp` to the corresponding Supabase project ref.
3. Check the n8n Data Table for an existing recent wake operation.
4. If a wake is already in progress, return `waking` without another restore.
5. Query current project state.
6. Call `POST /v1/projects/{ref}/restore` only when the project is inactive.
7. Record demo key, `waking`, requested timestamp, last checked timestamp, and
   last normalized result.
8. Return the website contract:

   ```json
   {
     "ok": true,
     "key": "alan",
     "state": "waking"
   }
   ```

9. Do not wait synchronously for full project readiness.
10. Let later status checks detect service-health readiness.

Set provider timeouts and bounded retries conservatively. Respect the Supabase
Management API rate limit and rely on the website's brief status cache plus n8n
Data Table deduplication to reduce request volume.

## Optional Preventive Activity

A separate scheduled n8n workflow may run the same Management API state and
service-health checks once or twice per day and update the n8n Data Table cache.
This is preventive only. The website routes must function safely without it.
Do not introduce Supabase project URLs or anon/publishable keys for this
availability workflow without a separate review.
