# Personal Website V2

This repository powers `jeremybrunet.com`.

The V2 foundation migrates the site from Vite to Next.js App Router with TypeScript, Tailwind CSS, MDX, and local content validation.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- MDX
- Zod
- Vitest
- Vercel

## Local Setup

```txt
npm install
npm run dev
```

## Validation

```txt
npm run lint
npm run typecheck
npm run test
npm run build
```

## Content

- Local essays live in `content/essays`.
- Essay frontmatter is validated in `lib/content/essays.ts`.
- Topics are centralized in `lib/topics/registry.ts`.
- Placeholder profile, demos, and contact pages are intentionally minimal in PR 1.

## Deployment Notes

Vercel production is configured to track `main`. Do not merge migration work without review.

The pre-Next.js production site is preserved on:

```txt
archive/pre-nextjs-redesign
```

Rollback options include redeploying the archive branch or reverting a future merge commit. Do not reset `main` without explicit approval.

## Related Repository

`DFATPUNK/demos` owns `demos.jeremybrunet.com`. Do not modify that repository during the initial website refactor.
