# Release Content Checklist

This checklist tracks human-supplied content required before `v2` is merged to
`main`. Placeholder content is not production-ready.

## Completed in the first owner-supplied content PR

- Final About introduction.
- Selected career entries and subordinate previous roles.
- Academic and certification entries.
- Local certificate assets for Codecademy, Zapier, and CS50.
- Verified testimonial translations supplied by the owner.
- External historical Medium writing references.
- LinkedIn profile link and restrained footer.
- Demo wording/topic review for the existing public demos.
- MLP public demo entry.
- Contact-page copy review, including the subject selector and HR example.
- In-progress flagship essay announcement and context page for
  `Event-driven databases 101`.
- Reusable publication-alert signup form for major essays and demos, with
  compact index and full context-page variants.

## Still required before release

- At least one recent local essay, or an explicit decision to launch with only
  external historical writing references.
- Removal or continued non-publication of the temporary `foundation-sample`
  essay.
- Vercel `CONTACT_WEBHOOK_URL` production configuration if still unset.
- Vercel demo availability status and wake webhook URLs, signing secret, and
  Alan/MLP project refs.
- Vercel publication-alert webhook URL and signing secret.
- n8n Supabase Management API token, Alan/MLP project refs, Mailchimp Marketing
  API credential, server prefix, Audience ID, and matching signing secrets.
- Final review of the `v2 -> main` release PR.
- Any unresolved defects found during final QA.

## Deferred after V2 launch

- Topic aggregation/filtering.
- External demo visual harmonization.
- CS229 immersive demo.

## Current content boundary

- `foundation-sample` is a draft and must not be treated as personal writing.
- External Medium entries are references only and do not duplicate article
  content locally.
- The site must not invent biography, career, academics, testimonials, social
  profiles, location, availability, salary, or hiring preferences.
