# Personal Website V2 — Lean Roadmap

## Goal

Ship a simple, fast and maintainable new version of `jeremybrunet.com`.

The project should be delivered in small pull requests.

---

## PR 1 — Foundation

Scope:

- preserve the current production version in an archive branch;
- migrate the repository from Vite to Next.js App Router;
- configure TypeScript;
- configure Tailwind CSS;
- configure MDX;
- add the `standard | immersive` essay layout field;
- implement only the standard renderer boundary;
- add mathematical formula support with KaTeX;
- create the global layout inspired by MatX;
- create desktop and mobile navigation;
- add placeholder routes:
  - `/`
  - `/essays`
  - `/demos`
  - `/contact`;
- add one standard sample MDX essay;
- do not build an immersive reading experience yet;
- confirm the Vercel production build works.

Do not implement final content yet.

Acceptance:

```txt
lint
typecheck
test
build
```

must pass.

---

## PR 2 — Who am I?

Scope:

- add the final static structure for:
  - introduction;
  - career;
  - academics;
  - testimonials;
- keep content in typed local files;
- preserve the minimal MatX-inspired layout.

No CMS.

---

## PR 3 — Essays

Scope:

- add a minimal reverse-chronological essays index;
- add `/essays/[slug]`;
- validate frontmatter, including `layout`;
- fully implement the standard essay renderer;
- add simple sharing controls;
- establish an explicit registry boundary for future immersive essays;
- support:
  - code blocks;
  - mathematical formulas;
  - tables;
  - images;
  - Airtable embeds;
  - n8n workflow embeds or links;
- prepare, but do not yet build, a JupyterLite/Pyodide integration.

Do not build a generic immersive essay system in this PR. Create one only when a concrete essay requires it.

No arbitrary server-side code execution.

---

## PR 4 — Demos

Scope:

- add a typed demo registry;
- create `/demos`;
- expose relative URLs such as:
  - `/demos/alan`;
  - `/demos/balatro`;
  - `/demos/pg-calculator`;
  - `/demos/mlp` later;
- initially use redirects or landing pages when the apps remain hosted elsewhere;
- do not break `demos.jeremybrunet.com`.

---

## PR 5 — Contact

Scope:

- create the conditional contact form;
- add server-side Zod validation;
- reject obvious fake email addresses;
- add honeypot protection;
- forward valid submissions to the n8n webhook;
- handle loading, success and error states;
- add `.env.example`.

Environment variable:

```txt
CONTACT_WEBHOOK_URL=
```

---

## PR 6 — Final polish

Scope:

- SEO metadata;
- sitemap;
- robots.txt;
- accessibility review;
- responsive review;
- performance review;
- final copy;
- Vercel production checklist.

---

## Deferred features

These features must not delay the first release:

- Nextra;
- CMS;
- search;
- topic aggregation pages;
- full demo app migration;
- real Jupyter kernels;
- server-side code execution;
- authentication;
- admin interface;
- analytics platform;
- bespoke immersive essays and scrollytelling until a concrete publication requires them.
