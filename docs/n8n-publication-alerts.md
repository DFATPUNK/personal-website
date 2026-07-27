# n8n Publication Alerts Workflow

This document describes the external workflow for the single publication-alert
signup list. No real Mailchimp API keys, server prefixes, Audience IDs, webhook
URLs, or signing secrets belong in Git.

## Website Contract

The website posts validated signups to n8n from the server route:

```txt
POST /api/publication-alerts
```

The server-only Vercel values are:

```txt
PUBLICATION_ALERTS_WEBHOOK_URL
PUBLICATION_ALERTS_WEBHOOK_SIGNING_SECRET
```

Requests include:

```txt
x-jeremy-timestamp: ISO timestamp
x-jeremy-signature: HMAC SHA-256 hex digest
```

The signature payload is `{timestamp}.{raw_request_body}`. n8n must recompute
the HMAC SHA-256 signature with the shared secret and compare it in constant
time. Reject stale timestamps, malformed JSON, invalid source keys, and invalid
email addresses.

## Mailchimp Setup

Use one global Mailchimp Audience, suggested name:

```txt
Jérémy Brunet — Publication alerts
```

n8n holds:

- Mailchimp Marketing API key.
- Mailchimp server prefix.
- Mailchimp Audience ID.
- Shared signing secret matching Vercel.

Use the stable Marketing API Lists/Audiences endpoints, not the beta Audiences
API.

## Add Or Update Member

Normalize the email by trimming whitespace and lowercasing it. Compute:

```txt
subscriber_hash = md5(normalized_lowercase_email)
```

Call:

```txt
PUT /3.0/lists/{audience_id}/members/{subscriber_hash}
```

Payload:

```json
{
  "email_address": "person@example.com",
  "status_if_new": "subscribed"
}
```

Existing subscribed contacts remain subscribed. Duplicate signup is idempotent.
Do not use double opt-in and do not use `pending`.

Then apply member tags:

```txt
POST /3.0/lists/{audience_id}/members/{subscriber_hash}/tags
```

Use:

```json
{
  "tags": [
    { "name": "publication-alerts", "status": "active" },
    { "name": "source:essay-event-driven-database", "status": "active" }
  ]
}
```

The source tag is derived from the safe `interestSource` context. Every signup
joins the same Audience.

## Suppressed Contacts

Do not silently reactivate contacts whose Mailchimp state is `unsubscribed`,
`cleaned`, or otherwise suppressed without verifying the exact supported
Mailchimp resubscription behavior. For V1, preserve that state and return a
safe response telling the visitor to contact `jeremy@jeremybrunet.com` if they
want to rejoin.

## Error Mapping

Map Mailchimp and n8n failures to visitor-safe responses. Do not return raw
provider status text, stack traces, response bodies, API keys, Audience IDs, or
server prefixes to the browser. Avoid logging full email addresses; use source
keys and redacted or hashed identifiers if logging is needed.

## Operations

Mailchimp remains the contact source of truth. No application database is
required for V1.

To export the Audience, use Mailchimp's Audience export UI or API export tools.
To unsubscribe or permanently delete a contact, use Mailchimp's member
management UI or the supported member deletion endpoint after confirming the
owner's intent.

Future publication alerts should be sent as Mailchimp campaigns to the single
Audience or the `publication-alerts` tag segment. Each campaign must identify
Jérémy Brunet, include Mailchimp's unsubscribe link or `*|UNSUB|*` merge tag,
and link to `/privacy`. Disable campaign open and click tracking when the
Mailchimp plan and campaign UI allow it. Do not implement custom tracking
without a separate review.
