# Personal Website V2 — Content Model

## Purpose

This document defines the minimum content structures required for the new website.

The site must stay simple. Content is stored locally in the repository and rendered statically whenever possible.

## Main content areas

### 1. About

Static content rendered from a small typed data file.

Recommended structure:

```ts
export type ProfileContent = {
  introduction: string
  career: CareerEntry[]
  academics: AcademicEntry[]
  testimonials: Testimonial[]
}
```

```ts
export type CareerEntry = {
  id: string
  organization: string
  role: string
  startDate: string
  endDate?: string
  summary: string
}
```

```ts
export type AcademicEntry = {
  id: string
  institution: string
  title: string
  date?: string
  description?: string
  url?: string
}
```

```ts
export type Testimonial = {
  id: string
  quote: string
  author: string
  role?: string
  organization?: string
}
```

Do not invent content. Empty sections are acceptable until real content is provided.

---

### 2. Essays

Essays are local MDX files stored in:

```txt
content/essays/
```

Each essay uses frontmatter:

```yaml
title: "Event-driven database architecture"
slug: "event-driven-database-architecture"
description: "A practical explanation of event-driven systems."
publishedAt: "2026-01-01"
updatedAt: "2026-01-01"
status: "draft"
layout: "standard"
tags:
  - automations
  - airtable
  - data
featured: true
```

Minimum TypeScript model:

```ts
export type EssayStatus = "draft" | "published" | "external"
export type EssayLayout = "standard" | "immersive"

export type EssayMetadata = {
  title: string
  slug: string
  description: string
  publishedAt?: string
  updatedAt?: string
  status: EssayStatus
  layout: EssayLayout
  tags: TopicSlug[]
  featured?: boolean
  externalUrl?: string
  repositoryUrl?: string
}
```

The essays index should default to a simple reverse-chronological list.

The essay renderer supports two layout values:

- `standard`: the default long-form MDX layout;
- `immersive`: a bespoke React reading experience registered for a specific essay.

The first release implements `standard`. It validates and reserves `immersive`, but does not need to ship a generic immersive engine.

MDX must support:

- standard Markdown;
- code blocks;
- mathematical formulas;
- tables;
- images;
- Airtable embeds;
- n8n workflow embeds or links;
- JupyterLite or Pyodide-based interactive examples later;
- custom React components;
- optional side notes;
- lightweight share actions.

Share actions should be derived from the essay canonical URL rather than stored in frontmatter.

Recommended math support:

```txt
remark-math
rehype-katex
```

Recommended code highlighting:

```txt
Shiki
```

Do not implement arbitrary server-side code execution.

For immersive essays, use an explicit slug-to-component registry. Do not resolve arbitrary component paths from frontmatter.

---

### 3. Demos

The `/demos` page is a static index.

Each item links to a relative path such as:

```txt
/demos/mlp
/demos/alan
/demos/balatro
```

Minimum model:

```ts
export type DemoStatus = "live" | "work-in-progress" | "archived"

export type Demo = {
  title: string
  slug: string
  description: string
  status: DemoStatus
  tags: TopicSlug[]
  href: `/demos/${string}`
  repositoryUrl?: string
  featured?: boolean
}
```

The demo registry should live in one file:

```txt
src/content/demos.ts
```

Each demo route may later:

- render the app directly;
- redirect to an existing deployment;
- proxy an existing project;
- display a short landing page before opening the app.

Do not migrate all demo applications in the first PR.

---

### 4. Contact

The contact page is dynamic.

Base model:

```ts
export type ContactTopic =
  | "need-help"
  | "job-offer"
  | "essay-code-comment"
  | "other"
```

```ts
export type ContactFormInput = {
  email: string
  topic: ContactTopic
  message: string
  preferredInterviewDate?: string
  honeypot?: string
}
```

Conditional behavior:

- `need-help`: ask for the visitor's typical workday and where they are stuck;
- `job-offer`: ask for the role, why Jérémy may fit, and a preferred interview date;
- `essay-code-comment`: ask for the essay or repository name and the comment;
- `other`: ask for a general message.

The server must validate the payload before forwarding it to n8n.

Expected n8n webhook payload:

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

The webhook URL must be stored in:

```txt
CONTACT_WEBHOOK_URL
```

Never expose this URL in client-side code.

---

## Topics

Topics are intentionally simple.

Use one registry:

```ts
export const topics = [
  "ai",
  "automations",
  "zapier",
  "airtable",
  "python",
  "machine-learning",
  "n8n",
  "apis",
  "data",
  "event-driven-architecture",
] as const

export type TopicSlug = (typeof topics)[number]
```

Use the same topics for essays and demos.

A dedicated topic page can be added later, but it must not block the first release.

---

## Validation rules

Use Zod for runtime validation.

Validate:

- unique slugs;
- valid URLs;
- valid topic values;
- required essay frontmatter;
- valid contact topic;
- required conditional form fields;
- non-past interview dates;
- obviously fake email addresses;
- maximum message length.

The build should fail when static content is invalid.

---

## Simplicity rules

1. Keep content local.
2. Do not add a database.
3. Do not add a CMS.
4. Do not add authentication.
5. Do not create a complex knowledge graph.
6. Do not implement executable server-side notebooks.
7. Prefer one registry file per content type.
8. Add abstractions only when a real feature needs them.
