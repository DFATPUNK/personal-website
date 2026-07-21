# Codex Start Prompt — Personal Website V2

Read the attached project documents before making any changes:

- `SPECIFICATION.md`
- `ARCHITECTURE.md`
- `CONTENT_MODEL.md`
- `ROADMAP.md`

The most important product constraint is simplicity.

The website contains four main areas:

1. `Who am I?` — static content.
2. `Essays` — local MDX content supporting code, mathematical formulas, Airtable embeds, n8n workflows and future browser-based notebook examples. Essays have two declared layout values: `standard` and `immersive`. The standard layout is the default; immersive layouts are bespoke and deferred until a concrete publication requires one.
3. `Demos` — a static catalog leading to relative paths such as `/demos/mlp`.
4. `Contact` — a conditional form that validates submissions server-side and forwards valid payloads to an n8n webhook.

Start with **PR 1 — Foundation** from `ROADMAP.md`.

Before coding:

1. Audit the current `DFATPUNK/personal-website` repository.
2. Audit the related `DFATPUNK/demos` repository.
3. Identify the current production branch and commit.
4. Create an immutable archive branch from the production commit.
5. Create a dedicated feature branch for PR 1.
6. Write a concise implementation plan.

Then implement only PR 1.

Requirements:

- migrate from Vite to Next.js App Router;
- use TypeScript and Tailwind CSS;
- configure MDX;
- add and validate the `standard | immersive` essay layout field;
- implement only the standard renderer boundary in this PR;
- support mathematical formulas with KaTeX;
- create the MatX-inspired global layout and navigation;
- add placeholder pages for `/`, `/essays`, `/demos`, and `/contact`;
- add one standard sample MDX essay with a code block and a mathematical formula;
- do not implement scrollytelling, simulations, or a generic immersive renderer;
- preserve useful existing assets;
- do not modify the `DFATPUNK/demos` repository;
- preserve the architecture so a future essay can register a bespoke immersive renderer by slug;
- do not implement all later phases;
- do not merge the pull request.

Before opening the PR, run:

- lint;
- typecheck;
- tests;
- production build.

The PR description must include:

- archive branch name;
- archived commit SHA;
- rollback instructions;
- migration summary;
- screenshots for desktop and mobile;
- commands executed;
- known limitations;
- any Vercel action requiring human approval.

Keep the implementation small, readable and easy to continue.
