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
  order: 40,
}
```

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
