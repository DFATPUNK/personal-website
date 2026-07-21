# Contact Delivery

The contact form posts JSON to:

```txt
POST /api/contact
Content-Type: application/json
```

Request payload:

```ts
type ContactTopic =
  | 'need-help'
  | 'job-offer'
  | 'essay-code-comment'
  | 'other'

type ContactFormInput = {
  email: string
  topic: ContactTopic
  message: string
  preferredInterviewDate?: string
  honeypot?: string
}
```

The public endpoint returns structured JSON with generic messages. Validation errors may include field-level messages. Delivery failures do not expose webhook status text, response bodies, environment variable names, or stack traces.

## Normalization

Before delivery, the server trims the email and topic, lowercases the email address, normalizes line endings to `\n`, trims leading and trailing message whitespace, and collapses four or more consecutive newline characters to three. Empty interview-date strings are omitted.

The message is not otherwise rewritten, so visitors can paste code, JSON, URLs, angle brackets, repository names, snippets, and stack traces. Null bytes and unsupported control characters are rejected.

## Email Checks

The form performs deterministic local anti-dummy checks only. It does not verify that a mailbox exists.

The base local part before a plus tag is rejected when it exactly matches obvious placeholders such as `test`, `testing`, `dummy`, `fake`, `azerty`, `qwerty`, `aaaa`, or `example`.

Reserved and fake domains are rejected case-insensitively, including `example.com`, `example.org`, `example.net`, `test.com`, `localhost`, `invalid`, and `.test` domains. The check avoids substring matching, so addresses like `latest@company.com` and `testing.engineer@company.com` are not rejected by this rule.

## Honeypot

The client includes one off-screen honeypot input with an innocuous DOM field name. It is hidden from assistive technology and removed from keyboard navigation.

When the submitted honeypot value is populated, the endpoint does not call the webhook and returns the same generic success response used for a valid submission. The honeypot value is never forwarded or logged.

## n8n Payload

Valid non-honeypot submissions are forwarded to the URL stored in `CONTACT_WEBHOOK_URL`:

```json
{
  "email": "person@company.com",
  "topic": "job-offer",
  "message": "Description of the opportunity",
  "preferredInterviewDate": "2026-08-01",
  "submittedAt": "2026-07-20T18:00:00.000Z",
  "source": "jeremybrunet.com"
}
```

`preferredInterviewDate` is omitted when absent. Honeypot and internal anti-spam fields are never included.

Delivery uses `POST`, JSON, `Content-Type: application/json`, `cache: no-store`, and an `AbortController` timeout. Non-2xx webhook responses, timeouts, missing configuration, and network failures are treated as delivery failures.

## Environment

Required variable:

```txt
CONTACT_WEBHOOK_URL=
```

The Vercel Preview build can succeed without this value, but actual delivery returns a generic delivery-unavailable response until a human configures the secret. This PR does not change Vercel project settings or any n8n workflow.

`NEXT_PUBLIC_SITE_URL` controls the server-derived `source` hostname and defaults to `https://jeremybrunet.com`.

## Local Testing

Do not send personal test messages to a real webhook. Use tests with mocked `fetch`, or configure a temporary local/test webhook only after explicit human approval.
