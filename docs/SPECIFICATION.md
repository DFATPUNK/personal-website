# Personal Website V2 — Product Specification

**Document status:** Draft v1  
**Owner:** Jérémy Brunet  
**Primary repository:** `DFATPUNK/personal-website`  
**Related repository:** `DFATPUNK/demos`  
**Primary domain:** `https://jeremybrunet.com`  
**Current production domain alias:** `https://www.jeremybrunet.com`  
**Reference aesthetic:** `https://matx.com`  
**Target stack:** Next.js + TypeScript + Tailwind CSS + MDX + Vercel

---

## 1. Purpose of this document

This document is the product and functional specification for the second major version of Jérémy Brunet’s personal website.

It is intended to be the long-term reference document for Codex, future contributors, and Jérémy himself. It describes the product goals, page structure, content model, interaction requirements, integration constraints, and acceptance criteria for the project.

This specification should be read before implementing any feature. It should not be treated as a single giant task to complete in one pull request. The project must be delivered incrementally through small, reviewable pull requests.

The related technical details belong in companion documents:

- `ARCHITECTURE.md` — implementation architecture and code organization.
- `CONTENT_MODEL.md` — exact schemas for essays, demos, topics, career entries, academics, testimonials and other content.
- `DESIGN.md` — visual system, layout, typography and UI rules.
- `CONTRIBUTING.md` — branch strategy, PR workflow and review checklist.
- `ROADMAP.md` — phased delivery plan.
- `DECISIONS.md` — architecture decision records.

This document focuses on **what the website must become** and **why**.

---

## 2. Executive summary

The new `jeremybrunet.com` must become more than a personal homepage.

It should be:

1. A clear personal website.
2. A technical portfolio.
3. A public knowledge base.
4. A catalog of live demos.
5. A publishing platform for technical essays that can range from conventional long-form articles to bespoke interactive reading experiences.
6. A recruiter-friendly interface for exploring skills by topic.
7. A long-term platform for demonstrating expertise in automation, AI workflows, event-driven databases, no-code/low-code systems, APIs, and machine learning.

The site should feel minimal, serious, fast and editorial. The visual inspiration is MatX: narrow typography-first pages, a stable navigation model, clear sections, restrained design, and very little visual noise.

The new site must use:

- Next.js App Router.
- TypeScript.
- Tailwind CSS.
- MDX.
- Vercel.

The current production website must be preserved before the refactor begins. The migration from the current Vite-based app to Next.js must happen on a dedicated feature branch and must be reviewable through a pull request.

---

## 3. Product vision

The site should help a technical recruiter, CTO, hiring manager, potential client, or collaborator understand Jérémy’s profile in less than five minutes, while still allowing deep technical exploration for people who want to evaluate his work in detail.

The visitor should be able to answer:

- Who is Jérémy Brunet?
- What has he built?
- What does he understand deeply?
- What kind of technical problems can he solve?
- What evidence exists beyond a résumé?
- Can he explain complex systems clearly?
- Can he build and document production-like software?
- Can he connect automation, AI, databases, APIs and machine learning into practical workflows?

The website should therefore combine three layers:

### 3.1 Identity layer

The identity layer answers:

- Who I am.
- What I have done.
- What I am learning.
- What kind of work I am looking for.
- How to contact me.

### 3.2 Proof layer

The proof layer answers:

- What demos exist.
- What repositories exist.
- What workflows, automations or prototypes can be inspected.
- What projects demonstrate my skills.

### 3.3 Knowledge layer

The knowledge layer answers:

- What topics I understand.
- What essays I have written.
- How I reason about technical architecture.
- How I explain event-driven database architecture, automation systems, AI tools, machine learning pipelines and API integrations.

The best version of the site makes these three layers feel unified rather than separate.

---

## 4. Target audiences

### 4.1 Technical recruiters

Recruiters need a fast way to understand Jérémy’s profile. They may not inspect code in depth, but they need strong signals:

- professional clarity;
- recognizable skills;
- evidence of projects;
- direct contact path;
- downloadable or linkable material;
- topic-based exploration.

The `Topics` system is especially important for this audience. A recruiter interested in “Automations”, “Python”, “AI” or “Airtable” should be able to click a tag and immediately see all relevant essays, demos and professional entries.

### 4.2 CTOs, engineering managers and staff engineers

Technical evaluators need deeper signals:

- architecture thinking;
- maintainable code;
- credible demos;
- interactive essays;
- technical explanations;
- clear tradeoffs;
- testing and deployment discipline.

They should be able to browse essays, inspect demos, and understand how Jérémy thinks about systems.

### 4.3 Potential clients

Potential clients may want help with:

- automation workflows;
- no-code/low-code systems;
- Airtable architecture;
- Zapier, Make or n8n;
- AI-powered internal tools;
- data workflows;
- API integrations.

The contact form must guide them into describing their day-to-day problem and where they are stuck.

### 4.4 Peers and collaborators

Peers may arrive through essays, GitHub, LinkedIn, Medium, or demos. They should be able to:

- read essays;
- inspect code examples;
- interact with embeds;
- find related projects;
- contact Jérémy with technical comments.

### 4.5 Jérémy as future maintainer

The website must be easy for Jérémy to maintain over time. Adding a new essay, demo or topic should not require restructuring the app. The content architecture must be simple enough to preserve momentum.

---

## 5. Non-goals

This project must avoid becoming too large too early.

The following items are explicitly out of scope for the first major delivery unless a later roadmap phase says otherwise:

- A full CMS.
- User accounts.
- Admin dashboard.
- Public comments.
- A database-backed content system.
- Authentication.
- A custom analytics backend.
- Full migration of all demo apps into the personal website.
- Replacing `demos.jeremybrunet.com` immediately.
- Nextra.
- Scraping Medium.
- Real-time collaborative editing.
- Arbitrary server-side code execution.
- Server-side Jupyter kernels.
- SMTP-based mailbox verification.
- Complex scheduling or calendar booking.
- A heavy component library.
- A complex animation system.
- A pixel-perfect copy of MatX.

The system must be designed so that some of these features can be added later, but they must not block the first usable version.

---

## 6. Repositories and deployment context

### 6.1 Primary repository

The primary repository is:

```txt
DFATPUNK/personal-website
```

This repository currently powers `jeremybrunet.com` / `www.jeremybrunet.com`.

The current implementation is a React + Vite + TypeScript application. The refactor will migrate it to Next.js.

### 6.2 Related repository

The related repository is:

```txt
DFATPUNK/demos
```

This repository currently serves the `demos.jeremybrunet.com` subdomain and routes visitors to individual demo applications.

The new personal website must understand and document the relationship with this repository, but should not modify it during the initial refactor unless explicitly approved.

### 6.3 Production preservation

Before any destructive migration work:

1. Identify the current production branch.
2. Identify the production commit.
3. Create an archive branch from that commit.
4. Do not modify the archive branch.

Recommended archive branch:

```txt
archive/pre-nextjs-redesign
```

Recommended working branch:

```txt
feat/nextjs-mdx-redesign
```

The production branch must not be rewritten directly.

### 6.4 Vercel

The new site must deploy cleanly on Vercel.

The project should assume:

- production branch remains under human control;
- environment variables may be needed for contact delivery;
- no secrets are committed;
- domain configuration is not changed automatically by Codex;
- Vercel rewrites should be handled cautiously;
- any required manual deployment actions must be documented in the PR.

---

## 7. High-level site map

The new public site must include these routes:

```txt
/
 /essays
 /essays/[slug]
 /demos
 /topics
 /topics/[tag]
 /contact
```

The implementation should also provide:

```txt
/not-found
```

The canonical domain for metadata should be:

```txt
https://jeremybrunet.com
```

The existing `www` domain must not be broken.

---

## 8. Global navigation

The primary navigation should be minimal and stable.

Top-level navigation items:

```txt
About
Essays
Demos
Contact
```

The name or monogram of Jérémy should appear above or near the navigation.

On desktop, the site should use a left-side navigation column inspired by MatX. On mobile, it should become a compact accessible header or menu.

The active page must be visually clear without relying on heavy animations.

The navigation must be keyboard-accessible.

---

## 9. Visual direction

The website should be inspired by MatX, not copied from it.

Key characteristics:

- editorial;
- minimal;
- typography-first;
- restrained;
- fast;
- precise;
- calm;
- technical without looking cold;
- enough whitespace to let the content breathe.

The design should use:

- a light background;
- dark text;
- one or very few accent colors;
- subtle borders;
- clear section divisions;
- no gratuitous gradients;
- no excessive shadows;
- no large decorative illustrations unless justified.

The site must feel like a serious technical notebook and portfolio, not like a generic SaaS landing page.

---

## 10. Page specification — Home / About

### 10.1 Route

```txt
/
```

### 10.2 Purpose

The home page replaces the MatX “Company” page concept with a personal equivalent:

```txt
About
```

The page must introduce Jérémy’s profile and provide an editorial overview of:

- career;
- academics;
- testimonials.

It should not try to be a full CV. It should be a curated entry point.

### 10.3 Required sections

The home page must include:

```txt
Career
Academics
Testimonials
```

These sections correspond to the MatX-inspired transformation:

| MatX section | Personal website section |
|---|---|
| What we offer | Career |
| Target Workloads | Academics |
| Investors | Testimonials |

### 10.4 Introductory content

The page should start with a concise introduction.

The copy should be centralised in a content file and easy to change.

The content may use placeholders only if clearly marked as placeholders during development. Do not invent false professional facts.

### 10.5 Career section

The career section should present selected professional experience.

It should be based on a structured data model rather than hardcoded JSX.

Expected fields:

```ts
type CareerEntry = {
  organization: string
  role: string
  startDate: string
  endDate?: string
  summary: string
  tags: TopicSlug[]
  links?: ContentLink[]
}
```

The section should emphasize skills and outcomes relevant to:

- automation;
- AI workflows;
- internal tools;
- no-code/low-code systems;
- APIs;
- data workflows;
- machine learning;
- event-driven systems;
- CTO experience.

### 10.6 Academics section

The academics section should cover:

- formal education;
- certifications;
- structured learning paths;
- technical courses;
- current learning focus.

It should be based on structured data.

Potential entries may include:

- CS50;
- Codecademy ML Engineer path;
- machine learning;
- interpretability;
- CS231n if relevant;
- other verified learning items.

Do not invent credentials. If content is not yet verified in the repository, use placeholders or leave entries empty.

### 10.7 Testimonials section

The testimonials section must support testimonials but must not invent them.

Expected model:

```ts
type Testimonial = {
  quote: string
  author: string
  role?: string
  organization?: string
  sourceUrl?: string
  tags?: TopicSlug[]
}
```

If no real testimonial exists yet, the UI should show a clean empty state or omit the section content while keeping the structure available.

### 10.8 Home page acceptance criteria

The home page is acceptable when:

- it uses the shared site shell;
- it contains the required sections;
- the layout is responsive;
- content is structured;
- all tags are valid registered topics;
- no false claims are introduced;
- section layout is visually consistent with the rest of the site;
- it is accessible and readable on mobile.

---

## 11. Page specification — Essays index

### 11.1 Route

```txt
/essays
```

### 11.2 Purpose

The essays page is the public index of Jérémy’s writing.

It must support two types of essays:

1. External essays, such as existing Medium articles.
2. Local essays written in MDX.

The page must make it clear which entries are external and which are hosted locally.

### 11.3 Essay goals

The essays platform should allow Jérémy to publish long-form technical explanations that can include:

- code snippets;
- interactive examples;
- mathematical notation;
- Airtable embeds;
- diagrams;
- workflow illustrations;
- n8n embeds or exports;
- database tables;
- API examples;
- small demos;
- explanatory UI components;
- optional side notes or contextual panels on wide screens;
- simple sharing controls.

The essays index should remain deliberately minimal and primarily chronological: publication date, title, short description when useful, and topics. It should not become a grid of visually heavy marketing cards.

This platform is central to the long-term value of the website.

### 11.4 Existing Medium essays

The three existing Medium essays should initially be represented as external entries unless their content is manually migrated later.

Do not scrape Medium.

Create a data file where Jérémy can fill:

- title;
- description;
- URL;
- publication date;
- tags;
- status.

### 11.5 Essay list UI

The essays index should show:

- title;
- short description;
- publication date;
- tags;
- status if draft or external;
- link to local page or external article;
- optional featured indicator.

The list should be simple and text-forward.

### 11.6 Filtering

The essays index does not need a full filtering UI in the first phase if `/topics` handles cross-site filtering. However, every tag displayed on an essay card must link to the topic page.

### 11.7 Acceptance criteria

The essays index is acceptable when:

- it lists local and external essays;
- it handles empty or draft content gracefully;
- each tag links to the topic system;
- external links are clearly marked;
- metadata is structured;
- it is accessible and responsive.

---

## 12. Page specification — Essay detail

### 12.1 Route

```txt
/essays/[slug]
```

### 12.2 Purpose

The essay detail page renders one MDX essay.

It should be optimized for long reading sessions and technical explanation.

### 12.3 Required content features

Essay pages must support:

- headings;
- paragraphs;
- links;
- lists;
- code blocks;
- inline code;
- mathematical formulas and notation;
- blockquotes;
- tables;
- images;
- captions;
- callouts;
- optional side notes;
- tags;
- metadata;
- external links;
- repository links;
- embedded components;
- simple sharing controls;
- SEO metadata.

### 12.4 Essay layouts

The platform must support two essay layout categories without forcing every publication into the same reading experience.

#### Standard layout

```yaml
layout: "standard"
```

This is the default and must cover the large majority of publications.

It provides:

- a consistent article shell;
- excellent long-form typography;
- code blocks;
- mathematical formulas;
- images and tables;
- embeds;
- optional side notes;
- a table of contents when useful;
- simple share actions.

The standard layout is required in the first essays implementation.

#### Immersive layout

```yaml
layout: "immersive"
```

This is reserved for exceptional publications that require a bespoke reading experience, such as:

- full-screen covers;
- scroll-driven storytelling;
- custom simulations;
- synchronized visualizations;
- chapter-based navigation;
- custom React interfaces.

An immersive essay must still participate in the common publishing system:

- it appears in the essays index;
- it has the same metadata and topics;
- it keeps a canonical essay URL;
- it provides SEO metadata;
- it remains accessible from the main navigation.

The architecture must recognize the `immersive` value from the beginning, but a complete immersive renderer is not part of the initial implementation. It should only be developed when a concrete essay justifies it.

### 12.5 MDX frontmatter

Local essays must use typed frontmatter.

Example:

```yaml
title: "Event-driven database architecture"
slug: "event-driven-database-architecture"
description: "A practical essay about designing event-driven systems with Airtable, automations and data workflows."
publishedAt: "2026-01-01"
updatedAt: "2026-01-01"
status: "draft"
layout: "standard"
tags:
  - event-driven-architecture
  - airtable
  - automations
featured: true
externalUrl:
repositoryUrl:
cover:
```

Expected `status` values:

```txt
draft
published
external
```

The full exact schema belongs in `CONTENT_MODEL.md`.

### 12.6 Interactive essay target

A future flagship essay on event-driven database architecture should demonstrate:

- event-driven thinking;
- database design;
- Airtable tables;
- automation triggers;
- workflow orchestration;
- API interactions;
- data lineage;
- practical debugging;
- tradeoffs between no-code, low-code and custom code;
- how to reason about systems.

The platform must be able to host this essay comfortably.

### 12.7 Table of contents

A table of contents is optional but recommended for long essays.

It should not distract from reading. If implemented, it must be accessible and responsive.

### 12.8 Code presentation and sharing

Code snippets should be readable, copyable, syntax-highlighted and stable.

Code execution is not required in the first implementation.

The standard essay layout should expose lightweight sharing actions:

- copy the canonical link;
- use the Web Share API when supported;
- share by email;
- optionally open prefilled LinkedIn and X share URLs.

Sharing controls must not require a third-party tracking widget.

### 12.9 Acceptance criteria

The essay detail page is acceptable when:

- MDX renders correctly;
- both `standard` and `immersive` are valid layout values;
- the standard layout is fully implemented;
- immersive essays can be represented without requiring the immersive renderer to be finished;
- frontmatter is validated;
- invalid slugs return not found;
- tags link to topics;
- code blocks render correctly;
- embedded components can be used safely;
- SEO metadata is present;
- the reading experience is excellent on desktop and mobile.

---

## 13. Interactive MDX components

Interactive components are a strategic feature. They make the essays more convincing for technical readers.

The first implementation should create safe foundations, not a full notebook runtime.

### 13.1 CodeBlock

A `CodeBlock` component must support:

- syntax highlighting;
- optional language label;
- optional file name;
- copy-to-clipboard;
- horizontal scrolling;
- accessible controls;
- minimal client-side JavaScript.

Recommended tools may include Shiki or `rehype-pretty-code`.

### 13.2 AirtableEmbed

A reusable component must exist for Airtable embeds.

Example API:

```tsx
<AirtableEmbed
  src="https://airtable.com/embed/..."
  title="Event log table"
  height={600}
/>
```

Requirements:

- `title` is required;
- iframe must be responsive;
- lazy loading should be enabled;
- fallback link must exist;
- do not expose private data;
- only public Airtable views should be embedded;
- sandbox restrictions should be as strict as possible without breaking Airtable.

### 13.3 WorkflowEmbed / N8nEmbed

A component should exist for workflow-related embeds or fallbacks.

It should support:

- a public iframe if available;
- an image/diagram fallback;
- a link to a workflow;
- a static JSON display if needed.

Do not assume private n8n workflows are publicly embeddable.

### 13.4 InteractiveDemo

A generic component should allow embedding an external demo safely.

Example API:

```tsx
<InteractiveDemo
  src="https://demos.jeremybrunet.com/alan"
  title="HR onboarding demo"
  height={700}
/>
```

Requirements:

- title is required;
- iframe must be responsive;
- allowed domains should be configurable;
- fallback link must exist;
- no unsafe default permissions.

### 13.5 ExecutableCode

The project should define the concept of executable code but not implement unsafe execution.

Do not create a server endpoint that executes arbitrary user code.

Acceptable first version:

- a placeholder component;
- a sandboxed browser-only JavaScript prototype if safe;
- documentation of future approaches.

Future options to evaluate:

- Sandpack;
- Pyodide;
- JupyterLite;
- Observable embeds;
- external sandbox service;
- isolated ephemeral kernels.

### 13.6 Acceptance criteria

Interactive MDX foundations are acceptable when:

- components are reusable in MDX;
- components are documented;
- unsafe code execution is not introduced;
- iframes are accessible;
- embeds degrade gracefully;
- examples are included in at least one sample essay.

---

## 14. Page specification — Demos

### 14.1 Route

```txt
/demos
```

### 14.2 Purpose

The demos page is the canonical catalog of Jérémy’s technical demos.

It should present the demos consistently with the rest of the site, even if the actual demo applications remain hosted separately.

### 14.3 Relationship with `DFATPUNK/demos`

The `DFATPUNK/demos` repository currently serves the `demos.jeremybrunet.com` subdomain and routes paths to separate applications.

The first version of `/demos` should not try to move these applications into the main personal website.

Instead:

- create a clean catalog on `jeremybrunet.com/demos`;
- link to existing demo URLs;
- document the relationship;
- prepare a future migration path.

### 14.4 Demo registry

Demos should be defined in a typed registry.

Expected shape:

```ts
type Demo = {
  title: string
  slug: string
  description: string
  status: 'live' | 'work-in-progress' | 'archived'
  tags: TopicSlug[]
  href: string
  repositoryUrl?: string
  date?: string
  featured?: boolean
}
```

### 14.5 Initial demos

At minimum, the registry should include the current demos discovered in the `DFATPUNK/demos` repository.

Known examples from prior work include:

- HR onboarding engine / Alan demo;
- Balatro card generator;
- PG calculator.

Codex must inspect the repository rather than relying only on this list.

### 14.6 URL strategy

The first version should use:

```txt
jeremybrunet.com/demos
```

as the catalog.

Individual live demos may still live at:

```txt
demos.jeremybrunet.com/alan
demos.jeremybrunet.com/balatro
demos.jeremybrunet.com/pg-calculator
```

A future migration may move them to:

```txt
jeremybrunet.com/demos/alan
jeremybrunet.com/demos/balatro
jeremybrunet.com/demos/pg-calculator
```

But this must be done only after analyzing:

- Vite base paths;
- asset paths;
- API routes;
- cookies;
- CORS;
- Vercel rewrites;
- potential rewrite loops.

### 14.7 MLP demo

The demo registry supports MLP as a standalone-hosted public demo.

The MLP demo is represented with:

- Machine Learning;
- AI;
- Data;
- React;
- APIs.

### 14.8 Acceptance criteria

The demos page is acceptable when:

- demos are defined in a typed registry;
- current demos are included;
- each demo has valid topics;
- external live demo links work;
- repository links are shown when available;
- status is visible;
- the page uses the shared site shell;
- the relationship with `DFATPUNK/demos` is documented.

---

## 15. Topics system

### 15.1 Purpose

The topics system is one of the most important features of the website.

It lets visitors explore everything Jérémy has done or written about a specific skill or subject.

For example, a recruiter interested in automation should be able to click “Automations” and see:

- relevant essays;
- relevant demos;
- relevant career entries;
- relevant academic entries;
- possibly future notes or resources.

### 15.2 Topic registry

Topics must be centralized in a single registry.

Examples:

```txt
AI
Automations
Zapier
Airtable
Python
Machine Learning
n8n
APIs
Data
Event-driven Architecture
React
Next.js
```

Each topic should have:

```ts
type Topic = {
  slug: string
  label: string
  description?: string
}
```

Example slugs:

```txt
ai
automations
zapier
airtable
python
machine-learning
n8n
apis
data
event-driven-architecture
react
nextjs
```

No content item should reference an unknown topic.

### 15.3 Tag usage

The same topic registry must be used by:

- essays;
- demos;
- career entries;
- academic entries;
- testimonials if relevant;
- future content types.

Do not duplicate free-form tag strings across files.

### 15.4 Route `/topics`

The `/topics` route supports multi-topic filtering.

Canonical query format:

```txt
/topics?tags=ai&tags=python
```

If simple to support, also accept:

```txt
/topics?tags=ai,python
```

Default matching behavior should be OR because it is better for exploration.

Optional AND behavior should be possible:

```txt
/topics?tags=ai&tags=python&match=all
```

### 15.5 Route `/topics/[tag]`

The single-topic page should provide a clean canonical URL for a topic.

Example:

```txt
/topics/automations
```

This page should show all matching content for that topic.

### 15.6 Result grouping

Topic pages should group results by type:

```txt
Essays
Demos
Career
Academics
```

Each group should render only if it has matching content.

### 15.7 Empty states

If no content matches, the page should show a helpful empty state and a link back to all topics or the home page.

### 15.8 SEO behavior

Single-topic pages may be indexable.

Complex multi-tag query pages may use `noindex` if needed to avoid search index bloat.

### 15.9 Acceptance criteria

The topics system is acceptable when:

- topics are centralized;
- invalid topic references fail validation;
- tags are clickable across the site;
- `/topics/[tag]` works;
- `/topics?tags=...` works;
- OR and AND matching behave correctly;
- results are grouped by content type;
- empty states are handled;
- tests cover filtering logic.

---

## 16. Contact page

### 16.1 Route

```txt
/contact
```

### 16.2 Purpose

The contact page is the main conversion point of the site.

It should adapt to the reason why someone is contacting Jérémy.

It must be simple, serious and safe.

### 16.3 Base fields

The form must first request:

```txt
Email
Topic
```

Visible topic options:

```txt
Need your help
Job offer
Essay/code comment
Other
```

Internal values:

```txt
need-help
job-offer
essay-code-comment
other
```

### 16.4 Conditional fields — Need your help

When topic is `Need your help`, show:

```txt
Describe your typical day job and where you're stuck.
```

This is a required textarea.

It should guide potential clients to describe:

- what they do;
- what their process looks like;
- where they are blocked;
- what tools they currently use.

### 16.5 Conditional fields — Job offer

When topic is `Job offer`, show:

```txt
Describe the open position and why you think I may fit in.
```

This is a required textarea.

Also show a date field:

```txt
When would you like to book a first interview?
```

The date represents a preference, not a confirmed booking.

It must not accept a past date.

### 16.6 Conditional fields — Essay/code comment

When topic is `Essay/code comment`, show:

```txt
A penny for your thoughts! Quote the name of the essay or repository.
```

This is a required textarea.

This allows technical readers to reference:

- a specific essay;
- a repository;
- a code snippet;
- a demo.

### 16.7 Conditional fields — Other

When topic is `Other`, show:

```txt
Write me your message and I'll get back to you as soon as I've read it.
```

This is a required long textarea.

### 16.8 Form validation

Validation must happen both client-side and server-side.

The server is the source of truth.

Validate at minimum:

- email syntax;
- allowed topic;
- required conditional fields;
- maximum length;
- no past date for job offer;
- normalized whitespace;
- no obvious malicious payload;
- no obviously fake email local parts;
- no reserved or fake domains.

### 16.9 Email anti-dummy rules

Reject local parts that are obviously fake, such as:

```txt
test
testing
dummy
fake
azerty
qwerty
aaaa
example
```

Do not reject every address that merely contains one of these strings as part of a real-looking address.

Reject reserved or fake domains such as:

```txt
example.com
example.org
example.net
test.com
localhost
invalid
```

Do not claim to verify that a mailbox exists unless a real verification provider is used.

### 16.10 Email verification abstraction

The architecture should allow a future email verification provider.

Example:

```ts
interface EmailVerificationProvider {
  verify(email: string): Promise<EmailVerificationResult>
}
```

The first implementation can be deterministic and local.

Future providers may include MX lookup or a specialized email verification service.

### 16.11 Anti-spam

Implement at least:

- honeypot field;
- maximum length limits;
- generic error messages;
- optional minimum submission delay if easy;
- no exposed secrets;
- no intrusive CAPTCHA in the first version.

### 16.12 Contact delivery

Delivery should use an abstraction.

Possible implementations:

- Resend;
- n8n webhook;
- transactional email provider;
- other configured endpoint.

No API keys should be hardcoded.

If no delivery environment variable is configured:

- development can use a mock or safe log;
- production should not pretend success.

Create `.env.example` with relevant variables such as:

```txt
CONTACT_WEBHOOK_URL=
CONTACT_TO_EMAIL=
RESEND_API_KEY=
NEXT_PUBLIC_SITE_URL=https://jeremybrunet.com
```

### 16.13 Acceptance criteria

The contact page is acceptable when:

- conditional fields work;
- server validation exists;
- invalid fake emails are rejected;
- required fields are enforced;
- past interview dates are rejected;
- honeypot exists;
- no secret is committed;
- delivery behavior is documented;
- form states are accessible;
- success and error states are clear.

---

## 17. Content strategy

### 17.1 Content should be structured

The site must avoid scattering content across random JSX files.

Content should be centralized and typed.

Possible content directories:

```txt
content/
  essays/
src/
  content/
  demos.ts
  topics.ts
  profile.ts
```

The exact structure belongs in `ARCHITECTURE.md`, but the principle is mandatory:

> Content, presentation and business logic must remain separate.

### 17.2 Content should be easy to update

Jérémy should be able to:

- add a new demo by editing one registry file;
- add a topic in one place;
- add a new MDX essay by creating one file;
- update career entries without touching layout components;
- update contact text without editing validation code.

### 17.3 No false content

The site should not invent facts.

If specific information is missing, use:

- placeholders clearly marked as placeholders;
- empty states;
- TODO comments;
- draft entries not shown publicly.

### 17.4 Content quality

The tone should be:

- precise;
- confident;
- technical;
- human;
- not buzzword-heavy;
- not over-marketed.

The site should demonstrate expertise more than it claims expertise.

---

## 18. SEO and metadata

### 18.1 Global SEO

Implement:

- site title;
- title template;
- global description;
- canonical URL;
- Open Graph metadata;
- Twitter card metadata;
- favicon;
- robots.txt;
- sitemap.

### 18.2 Page-specific SEO

Each important page should have specific metadata:

- Home;
- Essays;
- Essay detail;
- Demos;
- Topics;
- Contact.

### 18.3 Essay SEO

Published local essays should include:

- title;
- description;
- publication date;
- update date if available;
- tags;
- canonical URL;
- Article JSON-LD if appropriate.

External essays should link to their canonical external source.

### 18.4 Person/Profile structured data

The home page may include structured data for Jérémy as a person/profile where accurate.

Do not invent social profiles or credentials.

### 18.5 Acceptance criteria

SEO is acceptable when:

- metadata is configured centrally;
- canonical URLs use `https://jeremybrunet.com`;
- sitemap builds successfully;
- robots.txt exists;
- essays have metadata;
- no fake structured data is emitted.

---

## 19. Accessibility

Accessibility is a core requirement, not a polish task.

### 19.1 Required practices

The site must use:

- semantic HTML;
- `main`;
- `nav`;
- `header`;
- `footer`;
- correct heading order;
- form labels;
- accessible errors;
- iframe titles;
- visible focus states;
- keyboard navigation;
- sufficient contrast;
- descriptive links;
- reduced motion support.

### 19.2 Forms

Form fields must have:

- visible labels;
- programmatic labels;
- accessible error messages;
- clear required state;
- accessible submission feedback.

### 19.3 Embeds

Iframes must have:

- descriptive title;
- fallback link;
- reasonable height;
- responsive wrapper.

### 19.4 Acceptance criteria

Accessibility is acceptable when:

- all navigation works with keyboard;
- focus is visible;
- forms are usable by screen readers;
- headings are logical;
- interactive elements have accessible names;
- automated accessibility checks do not report major issues.

---

## 20. Performance

The site should be fast by default.

### 20.1 Performance principles

- Prefer static rendering where possible.
- Avoid unnecessary client components.
- Keep JavaScript minimal.
- Use server components by default.
- Lazy-load embeds.
- Optimize fonts.
- Avoid large dependencies.
- Avoid heavy UI libraries.
- Avoid unnecessary animation libraries.

### 20.2 MDX performance

MDX should be compiled safely and efficiently.

Code highlighting should not require large client bundles if avoidable.

### 20.3 Embed performance

Airtable and demo embeds can be heavy. They should:

- lazy load;
- have fallback links;
- not block initial page render unnecessarily.

### 20.4 Acceptance criteria

Performance is acceptable when:

- pages load quickly on Vercel;
- Lighthouse performance is reasonable;
- client JavaScript is not excessive;
- embeds are lazy-loaded;
- no heavy component framework is introduced without justification.

---

## 21. Testing strategy

The project must include tests for the core logic.

### 21.1 Required test areas

At minimum, test:

1. Topic registry validation.
2. Tag normalization.
3. Unknown topic detection.
4. Topic filtering OR behavior.
5. Topic filtering AND behavior.
6. Essay frontmatter validation.
7. Demo registry validation.
8. Fake email local parts.
9. Reserved email domains.
10. Contact form conditional fields.
11. Past date rejection for job-offer submissions.

### 21.2 Testing approach

Use a testing setup appropriate for the Next.js project.

Do not overbuild end-to-end tests too early, but do not leave business logic untested.

### 21.3 Validation command

The project should provide commands for:

```txt
lint
typecheck
test
build
```

If a single combined command is added, document it.

### 21.4 Acceptance criteria

Testing is acceptable when:

- the required logic has tests;
- tests pass in a clean install;
- build passes;
- test commands are documented in README;
- failed validations catch real mistakes.

---

## 22. Security and privacy

### 22.1 Secrets

No secrets must be committed.

Environment variables must be documented in `.env.example`.

### 22.2 Embeds

Embeds must not expose private data.

Airtable embeds must be public views intentionally created for publication.

### 22.3 Contact form

The contact form must avoid:

- leaking validation internals;
- accepting unbounded input;
- pretending success when delivery fails in production;
- exposing webhook URLs in client code;
- storing sensitive messages in repository files.

### 22.4 Code execution

No arbitrary server-side code execution.

No unsafe `eval`.

No endpoint that runs user-submitted Python or JavaScript.

### 22.5 Acceptance criteria

Security is acceptable when:

- no secrets are committed;
- contact form uses server-side validation;
- embeds use safe defaults;
- code execution is not implemented unsafely;
- delivery failures are handled honestly.

---

## 23. Documentation requirements

The project must include documentation sufficient for Jérémy and Codex to continue the work.

### 23.1 Required docs

At minimum:

```txt
README.md
docs/SPECIFICATION.md
docs/ARCHITECTURE.md
docs/CONTRIBUTING.md
docs/ROADMAP.md
docs/DECISIONS.md
docs/DESIGN.md
docs/CONTENT_MODEL.md
docs/demos-integration.md
```

This file is `docs/SPECIFICATION.md`.

### 23.2 README

The README should include:

- project purpose;
- stack;
- local setup;
- scripts;
- environment variables;
- content editing guide;
- deployment notes;
- rollback notes;
- link to docs.

### 23.3 Demo integration documentation

A dedicated document should explain:

- what `personal-website` does;
- what `DFATPUNK/demos` does;
- current demo routes;
- why demos stay separate initially;
- future URL unification options;
- risks with rewrites and asset paths;
- how MLP is registered as a standalone-hosted demo.

### 23.4 Acceptance criteria

Documentation is acceptable when:

- a new contributor can understand the project;
- Codex can follow phase boundaries;
- rollback is documented;
- environment setup is documented;
- demo integration is explained.

---

## 24. Rollback strategy

The current production site must remain recoverable.

### 24.1 Archive branch

Create an archive branch before migration:

```txt
archive/pre-nextjs-redesign
```

The PR description must include:

- archive branch name;
- archived commit SHA;
- production branch at time of archive;
- rollback instructions.

### 24.2 Rollback procedure

The rollback procedure should explain how to restore the previous implementation if needed.

Possible rollback options:

- redeploy archive branch on Vercel;
- revert merge commit;
- reset production branch to archive SHA if appropriate and explicitly approved.

Do not perform destructive rollback automatically.

### 24.3 Acceptance criteria

Rollback is acceptable when:

- archive branch exists;
- SHA is documented;
- Vercel implications are documented;
- no production rewrite happens without approval.

---

## 25. Delivery strategy

This specification must not be implemented in one massive pull request.

Recommended phased delivery:

### Phase 1 — Infrastructure

- Preserve production.
- Create Next.js app.
- Configure Tailwind.
- Configure MDX.
- Implement shared layout.
- Implement basic routes.
- Create placeholder content.
- Add basic docs.

### Phase 2 — Home page

- Implement About.
- Add Career.
- Add Academics.
- Add Testimonials structure.

### Phase 3 — Essays platform

- Implement the chronological essays index.
- Implement the standard essay renderer.
- Add MDX rendering.
- Add mathematical formula support.
- Add sample essay.
- Add code highlighting.
- Add lightweight sharing controls.
- Add the `standard | immersive` layout field and renderer boundary.
- Do not build a full immersive experience until a concrete essay requires it.

### Phase 4 — Topics engine

- Implement topic registry.
- Implement `/topics`.
- Implement `/topics/[tag]`.
- Add filtering and tests.

### Phase 5 — Demo catalog

- Analyze `DFATPUNK/demos`.
- Create typed demo registry.
- Implement `/demos`.
- Document integration.

### Phase 6 — Contact system

- Implement conditional form.
- Add server validation.
- Add anti-spam.
- Add delivery abstraction.

### Phase 7 — SEO and metadata

- Add sitemap.
- Add robots.
- Add structured metadata.
- Polish page metadata.

### Phase 8 — Accessibility, responsive polish and performance

- Improve mobile.
- Improve focus states.
- Run accessibility checks.
- Optimize performance.

The actual roadmap may refine these phases, but the principle is mandatory:

> Small, reviewable PRs beat one giant migration PR.

---

## 26. Pull request expectations

Every PR must include:

- summary;
- scope;
- screenshots when UI changes;
- tests run;
- known limitations;
- rollback impact if relevant;
- environment variable changes if relevant.

The first major PR must include:

- production preservation details;
- migration notes;
- commands run;
- Vercel checklist;
- known limitations.

No PR should be merged automatically by Codex.

---

## 27. Acceptance criteria for the complete V2 foundation

The V2 foundation is acceptable when:

- current production has been archived;
- Next.js App Router is running;
- Tailwind is configured;
- MDX is configured;
- global layout exists;
- navigation works;
- `/` exists;
- `/essays` exists;
- `/essays/[slug]` works for at least one MDX essay;
- `/demos` exists;
- `/topics` exists;
- `/topics/[tag]` exists;
- `/contact` exists;
- topics are shared across content types;
- tag filtering works;
- contact validation works;
- fake emails are rejected;
- embeds are safe and accessible;
- tests cover core logic;
- lint passes;
- typecheck passes;
- tests pass;
- build passes;
- documentation exists;
- no secrets are committed;
- demo integration is documented;
- rollback is documented.

---

## 28. Known risks

### 28.1 Migration risk

The current project uses Vite. Migrating to Next.js can break:

- routing;
- asset paths;
- CSS;
- environment variables;
- deployment settings;
- build scripts;
- existing UI behavior.

The archive branch mitigates this risk.

### 28.2 Demo integration risk

Moving demos from `demos.jeremybrunet.com` to `jeremybrunet.com/demos/*` can break:

- assets;
- API paths;
- Vite base URLs;
- rewrites;
- cookies;
- CORS;
- deployment assumptions.

Therefore, the first version should use a catalog with external links.

### 28.3 Interactive code risk

Executable code can introduce serious security risks.

Therefore, executable code is a future project and must not be implemented unsafely.

### 28.4 Contact spam risk

Public contact forms attract spam.

The first version must include basic protections but may need stronger rate limiting later.

### 28.5 Content drift risk

A website with many content registries can become inconsistent.

Centralized topic validation and tests reduce this risk.

---

## 29. Future roadmap ideas

Future features may include:

- Nextra migration if the essays become a full documentation system;
- search across essays and demos;
- better topic landing pages;
- interactive event-driven database essay;
- Airtable-backed public examples;
- n8n workflow gallery;
- external demo visual harmonization;
- downloadable CV;
- richer project case studies;
- newsletter or RSS feed;
- analytics;
- contact form integration with n8n;
- calendar booking flow;
- MDX component gallery;
- bespoke immersive essays and scrollytelling;
- Sandpack or Pyodide experiments;
- automated Medium import if explicitly approved.

These features should be evaluated after the foundation is stable.

---

## 30. Final implementation principle

The website should not merely say that Jérémy can build technical systems.

The website itself should demonstrate it.

Every part of the site should reflect:

- clarity;
- maintainability;
- taste;
- technical judgment;
- security awareness;
- automation thinking;
- product thinking.

The long-term goal is for `jeremybrunet.com` to become a live technical artifact: a portfolio, a knowledge base, and a proof of work platform.
