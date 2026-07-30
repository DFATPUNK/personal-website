# Personal Website V2 — Technical Architecture

**Document status:** Draft v1  
**Owner:** Jérémy Brunet  
**Primary repository:** `DFATPUNK/personal-website`  
**Related repository:** `DFATPUNK/demos`  
**Target deployment:** Vercel  
**Target stack:** Next.js App Router + TypeScript + Tailwind CSS + MDX  
**Companion specification:** `docs/SPECIFICATION.md`

---

## 1. Purpose

This document defines the technical architecture for Personal Website V2. It translates the product requirements in `SPECIFICATION.md` into an implementation model for Codex and future contributors.

It covers repository structure, rendering, content, MDX, topics, demos, contact handling, validation, testing, security, deployment, migration from Vite, and rollback.

This is not a delivery checklist. Sequencing belongs in `ROADMAP.md`.

---

## 2. Architectural principles

### 2.1 Server-first

Use React Server Components by default. A component should become a Client Component only when it needs browser APIs, local state, event handlers, clipboard access, form interactivity, or a sandbox runtime.

Keep client boundaries narrow. Do not place `"use client"` on large layout trees.

### 2.2 Static-first

Prefer static generation for the home page, essays index, published essays, demos catalog, and single-topic pages.

Use dynamic rendering only where request-specific state is required, especially multi-topic query pages and contact submissions.

### 2.3 Content as data

Keep content separate from presentation. Use typed registries for structured content and MDX for long-form essays.

### 2.4 Minimal client JavaScript

Limit client code to mobile navigation, copy buttons, topic controls, contact form interactivity, and optional interactive embeds.

### 2.5 Explicit trust boundaries

Validate contact payloads, query parameters, MDX frontmatter, external embed URLs, environment variables, and transport responses.

### 2.6 Incremental migration

Do not migrate the main website and the demo platform simultaneously. First migrate `personal-website` to Next.js while keeping existing demos on their current infrastructure.

### 2.7 Low dependency count

Every dependency must have a clear role. Prefer a small local implementation when it is simpler and safer.

### 2.8 Portable content

Keep the MDX and content model portable enough for a future Nextra adoption.

---

## 3. Target platform

Use:

```txt
Next.js App Router
TypeScript strict mode
React Server Components
Tailwind CSS
MDX
Vercel
```

The canonical production URL is:

```txt
https://jeremybrunet.com
```

Use a centralized URL helper with `http://localhost:3000` as the local fallback.

Do not modify DNS, production domains, production branch settings, or Vercel project linkage without human approval.

---

## 4. Repository strategy

Before migration, preserve the current production commit in:

```txt
archive/pre-nextjs-redesign
```

This branch is immutable.

Initial work should happen on:

```txt
feat/nextjs-mdx-redesign
```

Each substantial phase should use a focused pull request. Codex must not merge automatically.

`DFATPUNK/demos` is read-only during the first website refactor. The personal site may link to and document demos, but must not silently change that repository.

---

## 5. Recommended directory structure

```txt
.
├── app/
│   ├── (site)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── essays/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── demos/page.tsx
│   │   ├── topics/
│   │   │   ├── page.tsx
│   │   │   └── [tag]/page.tsx
│   │   └── contact/
│   │       ├── page.tsx
│   │       └── actions.ts
│   ├── api/contact/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   ├── not-found.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── content/
│   ├── embeds/
│   ├── forms/
│   ├── layout/
│   ├── mdx/
│   ├── navigation/
│   └── ui/
├── content/essays/
├── docs/
├── lib/
│   ├── contact/
│   ├── content/
│   ├── demos/
│   ├── mdx/
│   ├── seo/
│   ├── topics/
│   ├── validation/
│   └── site-config.ts
├── public/
├── tests/
├── types/
├── .env.example
├── next.config.ts
├── package.json
└── tsconfig.json
```

Use the `(site)` route group to share the public shell without changing URLs.

Page-specific components may be colocated with routes. Reusable UI belongs under `components/`; reusable business logic belongs under `lib/`.

---

## 6. Application shell

### 6.1 Root layout

`app/layout.tsx` owns:

- HTML language;
- global metadata defaults;
- font configuration;
- global CSS;
- body classes.

### 6.2 Public layout

`app/(site)/layout.tsx` renders:

- desktop sidebar;
- mobile navigation;
- main content wrapper;
- footer.

Recommended hierarchy:

```txt
SiteShell
├── SidebarNavigation
├── MobileNavigation
├── MainContent
└── SiteFooter
```

Only the smallest interactive navigation component should be client-side.

---

## 7. Rendering strategy

| Route | Strategy | Data source |
|---|---|---|
| `/` | Static | typed profile registries |
| `/essays` | Static | MDX metadata + external essays |
| `/essays/[slug]` | Static | local validated MDX |
| `/demos` | Static | demo registry |
| `/topics/[tag]` | Static | topic registry + aggregated content |
| `/topics` | Request-specific filtering | static content + query parameters |
| `/contact` | Static shell + server mutation | contact schema + transport |

Use `generateStaticParams` for essay and single-topic routes.

Use `notFound()` for invalid essay or topic slugs.

Draft essays must not be public in production unless a future preview mode is explicitly implemented.

---

## 8. TypeScript and validation

Enable strict TypeScript.

Recommended options include:

```json
{
  "strict": true,
  "noUncheckedIndexedAccess": true,
  "exactOptionalPropertyTypes": true
}
```

Use runtime schemas for file-based and external input. Zod is the recommended default for:

- essay frontmatter;
- demo entries;
- topics;
- contact payloads;
- environment variables.

Avoid `any` and broad type assertions.

Where practical, infer `TopicSlug` from the canonical registry instead of using plain `string`.

---

## 9. Site configuration

Create `lib/site-config.ts` as the central source for:

- owner name;
- site name;
- title and description;
- canonical URL;
- navigation;
- social and repository links;
- public contact details;
- metadata defaults.

Do not scatter site identity values across page files.

---

## 10. Content architecture

Supported content types:

- profile copy;
- career entries;
- academic entries;
- testimonials;
- local essays;
- external essays;
- demos;
- topics.

Use typed modules for structured data and MDX for essays.

Suggested files:

```txt
lib/content/profile.ts
lib/content/career.ts
lib/content/academics.ts
lib/content/testimonials.ts
lib/content/external-essays.ts
lib/demos/registry.ts
lib/topics/registry.ts
content/essays/*.mdx
```

The build should fail clearly when:

- a required field is missing;
- a slug is duplicated;
- a topic is unknown;
- a URL is invalid;
- a published essay lacks a publication date;
- a demo status is unsupported.

---

## 11. Topic architecture

Create one canonical topic registry.

```ts
export const topics = [
  { slug: "ai", label: "AI" },
  { slug: "automations", label: "Automations" },
  { slug: "python", label: "Python" }
] as const
```

Generate lookup structures such as:

```ts
topicBySlug
topicSlugSet
```

Normalization should lowercase, trim, replace spaces with hyphens, collapse repeated hyphens, and remove unsupported punctuation.

Do not create new topics from arbitrary URL input.

Create a normalized cross-content representation:

```ts
type TopicContentItem = {
  id: string
  type: "essay" | "demo" | "career" | "academic"
  title: string
  description?: string
  href?: string
  tags: TopicSlug[]
  date?: string
}
```

Pure functions should handle:

```ts
filterContentByTopics(items, selectedTopics, mode)
groupTopicContent(items)
```

Supported modes:

```txt
any
all
```

Default to `any`; map `match=all` to `all`.

The `/topics` parser should accept repeated parameters and optionally comma-separated values, remove duplicates, and reject or ignore unknown values consistently.

Single-topic pages are canonical and may be indexed. Multi-topic query combinations may use `noindex, follow`.

---

## 12. MDX architecture

The MDX system must provide:

- typed frontmatter;
- static generation;
- custom components;
- syntax highlighting;
- safe embeds;
- future interactivity.

Choose one App Router-compatible solution, such as `@next/mdx` or `next-mdx-remote/rsc`, based on the simplest reliable implementation.

Do not compile arbitrary remote MDX.

Expose helpers such as:

```ts
getAllEssays()
getPublishedEssays()
getEssayBySlug(slug)
getEssaySlugs()
```

Use a centralized MDX component map:

```ts
export const mdxComponents = {
  a: MdxLink,
  pre: CodeBlock,
  Callout,
  AirtableEmbed,
  WorkflowEmbed,
  InteractiveDemo,
  ExecutableCode
}
```

Use server-side or build-time syntax highlighting, preferably Shiki or `rehype-pretty-code`.

Generate stable heading IDs for deep links and a future table of contents.

Avoid unrestricted raw HTML. Prefer controlled MDX components.

---

## 13. Essay renderer architecture

### 13.1 Layout type

The frontmatter model must include:

```ts
export type EssayLayout = "standard" | "immersive"
```

`standard` is the default.

### 13.2 Standard renderer

The standard renderer is the main implementation.

Recommended composition:

```txt
StandardEssay
├── EssayHeader
├── ShareActions
├── optional TableOfContents
├── MDXContent
├── optional SideNotes
└── EssayFooter
```

It should remain mostly server-rendered.

`ShareActions` may be a small Client Component for:

- Web Share API;
- clipboard copy;
- email share links;
- optional LinkedIn and X share URLs.

### 13.3 Immersive renderer boundary

Do not create one generic immersive engine prematurely.

Use a deliberate registry for bespoke essays:

```ts
type ImmersiveEssayRegistry = Record<
  string,
  React.ComponentType<ImmersiveEssayProps>
>
```

A frontmatter value of `layout: "immersive"` selects a custom renderer registered by essay slug.

If an immersive essay is not yet registered, development should fail clearly and production must not publish it.

This avoids unsafe dynamic imports derived directly from frontmatter and keeps each exceptional experience explicit.

### 13.4 Route selection

Conceptual route logic:

```tsx
if (essay.metadata.layout === "immersive") {
  return renderImmersiveEssay(essay)
}

return <StandardEssay essay={essay} />
```

### 13.5 Initial scope

The first foundation PR only needs to:

- validate the layout field;
- render a standard sample essay;
- establish the renderer boundary.

It must not build scrollytelling, simulations, or a generic immersive template.

---

## 14. MDX component boundaries

### 14.1 CodeBlock

Render highlighted code on the server and isolate clipboard behavior in a small client button.

```txt
CodeBlock
├── highlighted markup (server)
└── CopyCodeButton (client)
```

### 14.2 AirtableEmbed

Validate the URL protocol and host against an allowlist. Require a title, use lazy loading, and include a fallback link.

Only intentionally public Airtable views may be embedded.

### 14.3 InteractiveDemo

Use a centralized host allowlist, initially including only approved domains such as `demos.jeremybrunet.com`.

### 14.4 WorkflowEmbed

Model workflow display as a discriminated union:

- iframe;
- image;
- JSON;
- external link.

### 14.5 ExecutableCode

Do not execute arbitrary code on the server.

The first version should be a placeholder or a predefined browser-only sandbox. Future options include Sandpack, Pyodide, and JupyterLite.

Every embed must degrade gracefully.

---

## 15. Demo architecture

Create `lib/demos/registry.ts` as the source of truth for `/demos`.

A demo is a catalog record and may point to an external application.

```ts
type Demo = {
  title: string
  slug: string
  description: string
  status: "live" | "work-in-progress" | "archived"
  tags: TopicSlug[]
  href: string
  repositoryUrl?: string
  date?: string
  featured?: boolean
}
```

The first version must not reverse-proxy existing demo apps.

The personal site owns `/demos`; the related repository continues to own the routed applications.

A future `/demos/[slug]` may become a landing page, redirect, proxy, or migrated app route. Decide per demo after analyzing asset paths, APIs, cookies, CORS, and Vercel rewrites.

Do not perform live health checks during each page render.

---

## 16. Contact architecture

Use a small Client Component for conditional fields and a server-side submission path.

Prefer a Server Action unless a Route Handler offers a clearer transport boundary.

Use a discriminated union schema:

```ts
const contactSchema = z.discriminatedUnion("topic", [
  needHelpSchema,
  jobOfferSchema,
  essayCommentSchema,
  otherSchema
])
```

Email validation pipeline:

1. trim;
2. normalize domain case;
3. validate syntax;
4. enforce maximum length;
5. reject reserved domains;
6. reject suspicious exact local parts;
7. optionally invoke a verification provider;
8. return normalized data.

Avoid naive substring rejection. For example, reject `test@example.com` without rejecting `contest@realcompany.com`.

Add a honeypot and bounded input lengths.

Define abstractions:

```ts
interface RateLimiter {
  check(key: string): Promise<RateLimitResult>
}

interface ContactTransport {
  send(message: NormalizedContactMessage): Promise<ContactDeliveryResult>
}
```

Possible transports:

- webhook;
- Resend;
- development mock.

Do not log full message bodies in production. Do not display raw provider failures. Never show success when delivery failed.

---

## 17. Environment variables

Validate environment variables centrally.

Suggested variables:

```txt
NEXT_PUBLIC_SITE_URL=
CONTACT_TRANSPORT=
CONTACT_WEBHOOK_URL=
CONTACT_TO_EMAIL=
RESEND_API_KEY=
CONTACT_RATE_LIMIT_ENABLED=
```

Server-only variables must never be imported into client modules.

Create `.env.example` with placeholders only.

---

## 18. Styling architecture

Use Tailwind for layout, spacing, typography, responsive behavior, state styles, borders, and forms.

Use semantic CSS variables:

```css
--background
--foreground
--muted
--muted-foreground
--border
--accent
--accent-foreground
--content-width
--sidebar-width
```

Use one main font family, preferably through `next/font` or a system stack.

Create a controlled prose layer for essays rather than relying blindly on defaults.

Do not introduce a heavy component library. A small utility such as `clsx` is acceptable.

---

## 19. Component architecture

Recommended categories:

```txt
components/layout
components/navigation
components/content
components/mdx
components/embeds
components/forms
components/ui
```

Expected primitives:

- `SiteShell`;
- `SidebarNavigation`;
- `MobileNavigation`;
- `PageHeader`;
- `SectionRow`;
- `Divider`;
- `Tag`;
- `TagList`;
- `ContentCard`;
- `ExternalLink`;
- `FormField`;
- `Input`;
- `Select`;
- `Textarea`;
- `FormStatus`.

Prefer explicit props and semantic HTML. Avoid over-engineered polymorphic components.

---

## 20. SEO architecture

Create reusable metadata helpers:

```ts
createMetadata()
createEssayMetadata()
createTopicMetadata()
absoluteUrl(path)
```

Generate the sitemap from:

- static routes;
- published local essays;
- registered topics.

Do not include drafts.

Create `app/robots.ts`.

Render typed JSON-LD only from verified information.

External essays should retain their external canonical URL.

---

## 21. Error handling

Use `notFound()` for unknown essays and topics.

Content validation errors should fail the build with clear messages.

Model contact state explicitly:

```ts
type ContactFormState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string[]> }
  | { status: "success"; message: string }
```

Wrap external service errors and never expose raw stack traces or provider payloads.

---

## 22. Testing architecture

Unit-test pure logic:

- topic normalization;
- topic filtering;
- registry validation;
- email validation;
- conditional contact schemas;
- date validation;
- URL allowlists.

Component-test critical interactive behavior:

- mobile navigation;
- conditional contact fields;
- copy button;
- topic controls if interactive.

Integration-test:

- essay metadata loading;
- valid topic references;
- demo URL parsing;
- published essay resolution.

Suggested tools:

```txt
Vitest
React Testing Library
Playwright later
```

Required validation commands:

```txt
lint
typecheck
test
build
```

---

## 23. Linting, formatting, and imports

Use the official Next.js ESLint integration.

Use Prettier unless the repository already has a consistent formatter.

Use a single import alias:

```txt
@/*
```

Suggested import order:

1. framework;
2. external packages;
3. internal aliases;
4. relative imports;
5. styles.

Avoid deep relative paths.

---

## 24. Migration from Vite

Audit before deleting:

- assets;
- components;
- routes;
- public files;
- CV and certificates;
- fonts;
- copy;
- Vercel configuration;
- environment usage.

Preserve useful assets in `public/`.

Replace:

- `import.meta.env`;
- client-side routing;
- Vite base configuration;
- Vite entry points;
- Vite build scripts.

Remove Vite-specific packages only after confirming they are no longer used.

Validate a clean install, local development, production build, and Vercel preview.

Document every existing feature that is preserved, moved, deferred, or removed.

---

## 25. Demo integration boundary

The personal website must not fetch GitHub at runtime to render the demo catalog.

Keep demo metadata local and versioned.

When a demo is added to `DFATPUNK/demos`, update the local registry manually. Automated synchronization may be considered later.

Future consolidation options:

1. keep the subdomain permanently;
2. redirect `/demos/[slug]`;
3. reverse-proxy selected demos;
4. move to a monorepo;
5. rebuild selected demos inside the main app.

Document these options without selecting one globally.

---

## 26. Performance architecture

Prefer static rendering and server components.

Avoid:

- large browser-side syntax highlighters;
- heavy chart libraries without a concrete need;
- full icon-set imports;
- client-side MDX compilation;
- unnecessary animation packages.

Use `next/image` where appropriate.

Use one optimized font family.

Lazy-load Airtable and demo embeds. Consider click-to-load later if third-party embeds become too heavy.

---

## 27. Accessibility architecture

Use semantic HTML throughout.

Desktop and mobile navigation must expose the same destinations.

The mobile menu must support keyboard use, Escape to close where relevant, visible focus, and correct expanded state.

Forms must use labels, `aria-invalid`, `aria-describedby`, and live feedback where appropriate.

Every iframe requires a descriptive title and fallback link.

Respect `prefers-reduced-motion`.

---

## 28. Security architecture

Parse external URLs with `URL` and allow only approved protocols and hosts.

Use host allowlists for embeds.

Limit all contact payload sizes.

Never execute arbitrary user code on the server.

Never use unsafe `eval`.

Do not commit secrets.

A Content Security Policy may be added later after testing all required embed sources.

Prefer official or well-maintained dependencies.

---

## 29. Observability

The first version does not require a full observability stack.

At minimum:

- log contact delivery failures safely;
- expose clear build-time validation errors;
- use Vercel logs for server failures.

Do not log full contact messages in production.

Future options include Sentry, Vercel Analytics, structured logs, and demo uptime monitoring.

---

## 30. Documentation architecture

Expected documentation:

```txt
docs/
├── SPECIFICATION.md
├── ARCHITECTURE.md
├── CONTENT_MODEL.md
├── DESIGN.md
├── CONTRIBUTING.md
├── ROADMAP.md
├── DECISIONS.md
└── demos-integration.md
```

When documents conflict, follow this priority:

1. explicit user instruction;
2. latest accepted architecture decision;
3. `SPECIFICATION.md`;
4. `ARCHITECTURE.md`;
5. implementation detail.

Major architecture changes require an update to this document and an entry in `DECISIONS.md`.

---

## 31. Recommended dependencies

Potential dependencies:

```txt
zod
gray-matter
@next/mdx or next-mdx-remote
shiki or rehype-pretty-code
clsx
vitest
@testing-library/react
```

Optional:

```txt
tailwind-merge
```

Choose one tool per concern. Do not install all alternatives.

---

## 32. Phase 1 boundary

The first PR should establish foundations:

- archive branch;
- feature branch;
- Next.js migration;
- Tailwind;
- MDX;
- shared layout;
- sidebar and mobile navigation;
- route placeholders;
- topic registry foundation;
- content validation foundation;
- one sample essay;
- initial demo registry;
- documentation;
- lint, typecheck, tests, and build;
- Vercel preview validation.

The first PR should not attempt to finish:

- all final content;
- every essay;
- real executable notebooks;
- demo app migration;
- advanced SEO;
- final contact transport;
- complete visual polish.

---

## 33. Architectural acceptance criteria

The architecture is correctly implemented when:

- App Router is in use;
- Server Components are the default;
- content is separate from presentation;
- registries and frontmatter are validated;
- topics are centralized;
- unknown topics fail validation;
- essays are statically generated;
- demos remain externally hosted initially;
- contact submissions are validated on the server;
- delivery is abstracted;
- embed hosts are allowlisted;
- arbitrary server-side code execution does not exist;
- environment variables are validated;
- lint, typecheck, tests, and build pass;
- the current production version is archived;
- a Vercel preview works;
- documentation is current.

---

## 34. Future architecture directions

The architecture should leave room for:

- Nextra;
- full-text search;
- RSS;
- Sandpack;
- Pyodide;
- JupyterLite;
- monorepo migration;
- a CMS;
- demo metadata synchronization;
- webhook-driven contact workflows;
- multilingual content;
- recruiter-specific topic views.

These are future options, not current requirements.

---

## 35. Final architectural rule

Prefer the smallest architecture that preserves clarity, safety, consistency, extensibility, and reviewability.

The system should make it easy to add one essay, one demo, or one topic without requiring the maintainer to understand the entire application.
