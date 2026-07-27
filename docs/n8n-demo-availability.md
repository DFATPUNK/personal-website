# n8n Demo Availability Workflows

This document describes the external workflow contract for Alan and MLP demo
availability. No real project refs, tokens, anon keys, webhook URLs, or secrets
belong in Git.

## Website Contract

The website exposes:

```txt
GET /api/demos/availability
POST /api/demos/availability/{key}/wake
```

The browser never calls n8n, Supabase Management API, or Supabase project URLs
directly. The personal-site server calls n8n with:

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

- Supabase Management API access token.
- Alan Supabase project ref.
- MLP Supabase project ref.
- Alan Supabase URL and anon key for REST health checks.
- MLP Supabase URL and anon key for REST health checks.
- Shared HMAC signing secret matching Vercel.

The Supabase Management API access token must never be stored in Vercel or the
browser when n8n is the privileged boundary.

## Status Lookup Workflow

For each allowlisted key, `alan` and `mlp`:

1. Validate HMAC and timestamp.
2. Read a short-lived cached state from an n8n Data Table when available.
3. Query `GET /v1/projects/{ref}` from the Supabase Management API when stale.
4. Return `inactive` when the project is paused or inactive.
5. If the platform reports an active state, call the project Supabase REST root
   using the project anon key as a database-backed health check.
6. Return `active` when platform and REST health are healthy.
7. Return `waking` when restoration is in progress, or a recent wake request
   exists and REST health is not ready.
8. Return `unavailable` for unknown states, timeouts, malformed responses, or
   provider errors.
9. Cache only normalized safe state and timestamps.

Public responses must contain only logical keys, normalized states, and
`checkedAt`. Do not expose raw Supabase payloads.

Supabase notes that recently restored services can take a couple of minutes to
become fully operational. The REST health check remains authoritative before
reporting `active`.

## Wake Workflow

1. Validate HMAC, timestamp, and allowlisted key.
2. Check the n8n Data Table for an existing recent wake operation.
3. If a wake is already in progress, return `waking` without another restore.
4. Query current project state.
5. Call `POST /v1/projects/{ref}/restore` only when the project is inactive.
6. Record demo key, wake state, requested timestamp, last checked timestamp,
   and last normalized result.
7. Return `waking`.
8. Do not wait synchronously for full project readiness.
9. Let later status checks detect REST readiness.

Set provider timeouts and bounded retries conservatively. Respect the Supabase
Management API rate limit and rely on the website's brief status cache plus n8n
Data Table deduplication to reduce request volume.

## Optional Preventive Activity

A separate scheduled n8n workflow may send a lightweight REST health request to
Alan and MLP once or twice per day. This is preventive only. The website routes
must function safely without it.
