# Vercel Production Checklist

This is the manual checklist for the later release pull request from `v2` to
`main`. PR 6 does not deploy production.

## Automated checks

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`
- Public route checks
- 404 checks
- Metadata checks
- Sitemap checks
- Robots checks
- Accessibility checks
- Responsive checks
- External-link checks
- Dependency audit

## Human content checks

- Final About/profile copy
- Career entries and previous roles
- Academics and local certificate assets
- Testimonials
- External historical Medium references
- Real recent local essay, or explicit launch decision with external references
- Demo wording and MLP entry
- Link ownership, including LinkedIn and demo/repository links
- Keeping `foundation-sample` non-public
- Any unresolved defects found during final QA
- Legal/privacy wording if later desired

## Deferred after V2 launch

- Topic aggregation/filtering.
- External demo visual harmonization.
- CS229 immersive demo.

## Human Vercel checks

- Production Branch remains `main`.
- `v2` is not configured as Production Branch.
- Framework Preset remains Next.js.
- Build command and output settings are compatible with Next.js.
- `CONTACT_WEBHOOK_URL` is configured for Production before launch.
- `DEMO_STATUS_WEBHOOK_URL`, `DEMO_WAKE_WEBHOOK_URL`,
  `DEMO_WEBHOOK_SIGNING_SECRET`, `ALAN_SUPABASE_PROJECT_REF`, and
  `MLP_SUPABASE_PROJECT_REF` are configured only when the n8n/Supabase workflows
  are ready. `DEMO_STATUS_WEBHOOK_URL` must be the active production URL of the
  n8n status Webhook trigger, and `DEMO_WAKE_WEBHOOK_URL` must be the active
  production URL of the n8n wake Webhook trigger. Do not use n8n Test URLs for
  persistent Vercel configuration.
- `PUBLICATION_ALERTS_WEBHOOK_URL` and
  `PUBLICATION_ALERTS_WEBHOOK_SIGNING_SECRET` are configured only when the
  n8n/Mailchimp workflow is ready. `PUBLICATION_ALERTS_WEBHOOK_URL` must be the
  active production URL of the n8n publication-alert Webhook trigger.
- Signing-secret values match between n8n and Vercel.
- Vercel environment-variable changes are followed by a new deployment.
- `NEXT_PUBLIC_SITE_URL=https://jeremybrunet.com` is configured if the project
  configuration requires an explicit value.
- `jeremybrunet.com` remains the canonical domain.
- `www.jeremybrunet.com` behavior is verified.
- DNS is not changed automatically.
- Preview deployment is green.
- Final `v2 -> main` pull request is reviewed.
- Production deployment is monitored.
- Rollback branch remains available.

## Rollback checks

- Archive branch: `archive/pre-nextjs-redesign`
- Archived production commit: `2802735703ada85fa78df67da0763164429d2bcd`
- Vercel redeploy option remains available.
- Git revert option remains available.
- Do not rewrite `main`.
- Do not reset remote branches.

## External workflow credentials

n8n, not Git, must hold:

```txt
SUPABASE_MANAGEMENT_TOKEN
ALAN_SUPABASE_PROJECT_REF
MLP_SUPABASE_PROJECT_REF
DEMO_WEBHOOK_SIGNING_SECRET
MAILCHIMP_API_KEY
MAILCHIMP_SERVER_PREFIX
MAILCHIMP_AUDIENCE_ID
PUBLICATION_ALERTS_WEBHOOK_SIGNING_SECRET
```

The Supabase Management token needs `project_admin_read` for project state and
`project_admin_write` for project restore. n8n should keep Alan and MLP project
refs as an allowlist for signed webhook requests. Project refs are not
credentials, but they are server-only configuration and must not be exposed to
browser code. Alan and MLP Supabase project URLs, anon keys, publishable keys,
direct `/rest/v1/` health checks, and the Supabase Management API `/health`
endpoint are not required for the V1 availability workflows.

Do not create `NEXT_PUBLIC_*` variables for webhook URLs, signing secrets,
Supabase credentials, or Mailchimp credentials. The production build must pass
when demo availability and publication-alert variables are absent, but runtime
submissions and wake attempts return safe unavailable responses until configured.
