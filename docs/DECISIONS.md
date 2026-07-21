# Decisions

## 2026-07-21: Preserve Production Before Next.js Migration

The current Vite production version is preserved at:

- Branch: `archive/pre-nextjs-redesign`
- Commit: `2802735703ada85fa78df67da0763164429d2bcd`

All PR 1 work happens on `feat/nextjs-mdx-redesign`.

## 2026-07-21: Use Explicit Essay Renderer Registries

The foundation validates `standard | immersive` essay layout values, but only registers a standard MDX renderer.

Immersive essays must be registered by slug in code. The app does not resolve arbitrary component paths from frontmatter.
