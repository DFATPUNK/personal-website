# Content Cheat Sheet

Practical notes for maintaining local content on `jeremybrunet.com`.

## Add a draft standard essay

Create `content/essays/my-slug.mdx`. The filename must match `slug`, topic
values must exist in `lib/topics/registry.ts`, and a standard local essay must
be imported and registered in `lib/mdx/essay-registry.ts`.

```mdx
---
title: "My essay title"
slug: "my-slug"
description: "One concise sentence for the essays index and metadata."
status: "draft"
layout: "standard"
tags:
  - ai
  - data
featured: false
---

Write the MDX body here.
```

Then run:

```txt
npm run lint
npm run typecheck
npm run test
npm run build
```

## Publish a standard essay

Change `status: draft` to `status: published`, add `publishedAt` in
`YYYY-MM-DD` format, optionally add `updatedAt`, verify the registry import, and
check `/essays/[slug]`, `/essays`, and `sitemap.xml`.

## Announce an in-progress essay

Use `status: in-progress`, add `announcedAt`, write only a short context page,
and optionally add `interestSource` for the publication-alert form.

```mdx
---
title: "My exact provisional title"
slug: "my-essay-slug"
description: "One concise sentence."
announcedAt: "2026-07-27"
status: "in-progress"
layout: "standard"
tags:
  - automations
interestSource: "essay:my-essay-slug"
---
```

In-progress essays are public, included in static params, and rendered with
`noindex, follow`. They are excluded from the sitemap and do not emit published
Article JSON-LD. To publish later, change the status to `published`, add
`publishedAt`, review the page content as the finished essay, and verify the
sitemap and structured data.

The essays index shows `TBD` for in-progress entries while still using
`announcedAt` for ordering. Use the compact publication-alert form on the index:
it renders only the accessible email input, `Get publication alerts` button,
and any live validation/success/error message. Use the full form on the context
page, where the invitation, helper copy, Privacy link, `you@example.com`
placeholder, and `Notify me` CTA remain visible.

## Add an external essay reference

Use `status: external`, include `externalUrl`, a date, and registered topic
slugs. Do not register a local renderer for external entries and do not add a
local article body.

```mdx
---
title: "External article title"
slug: "external-article-title"
description: "Short local description of the external reference."
publishedAt: "2026-01-01"
status: "external"
layout: "standard"
tags:
  - user-experience
externalUrl: "https://medium.com/example/article"
---
```

Verify the entry opens externally from `/essays`, has no internal article route,
and is not included as an internal article URL in the sitemap.

## Add a topic

Edit `lib/topics/registry.ts`, add the slug to `topicSlugs`, add the label to
`topicLabels`, update content to use the slug, and run validation/tests. Tags
are not clickable until the future Topics feature is implemented.

## Add a demo hosted on the demos hub

Edit `lib/content/demos.ts`. Use `externalPath` for a path on
`https://demos.jeremybrunet.com`, plus slug, title, short description, longer
description paragraphs, topics, repository/manual links when verified, status,
and order. Public demos get `/demos/[slug]` static routes and sitemap entries.

## Add a demo hosted on another domain

Use `externalUrl` and do not use `externalPath`. Keep the shared
`DemoLaunchAction` mobile restriction, verify HTTPS, and verify repository links.

MLP example:

```ts
{
  slug: 'mlp',
  title: 'MLP — Machine Learning Pipeline Builder',
  shortDescription:
    'A no-code proof of concept for assembling small machine-learning pipelines from typed, reusable steps and artifacts.',
  description: [
    'MLP is a no-code proof of concept for assembling small machine-learning pipelines from typed, reusable steps and artifacts.',
  ],
  status: 'live',
  externalUrl: 'https://mlp.jeremybrunet.com/',
  repositoryUrl: 'https://github.com/DFATPUNK/mlp',
  tags: ['machine-learning', 'ai', 'data', 'react', 'apis'],
  availability: {
    provider: 'supabase',
    key: 'mlp',
  },
  order: 10,
}
```

Only Alan and MLP currently use Supabase availability. Use the safe logical
keys `alan` and `mlp`; never add provider refs, anon keys, access tokens, n8n
URLs, or secrets to the registry.

## Verification commands

```txt
npm run lint
npm run typecheck
npm run test
npm run build
```

## Git and PR workflow

Update `v2`, create a feature branch, commit, push, open a draft PR targeting
`v2`, wait for Vercel Preview, review desktop and mobile, and do not merge
directly to `main`.
