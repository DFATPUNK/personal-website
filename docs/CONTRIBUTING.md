# Contributing

## Branches

- Production branch: `main`
- Archive branch for the pre-Next.js site: `archive/pre-nextjs-redesign`
- Initial migration branch: `feat/nextjs-mdx-redesign`

Do not work directly on `main`.

## Validation

Run these commands before opening a PR:

```txt
npm run lint
npm run typecheck
npm run test
npm run build
```

## Scope

Keep PRs small and aligned with `docs/ROADMAP.md`.

Do not modify `DFATPUNK/demos` from this repository.

## Adding a standard essay

The essay platform uses an explicit registry. Do not replace it with dynamic
arbitrary module resolution.

1. Create an MDX file in `content/essays/`.
2. Use a filename that exactly matches the frontmatter slug, such as
   `event-driven-database-architecture.mdx`.
3. Provide valid frontmatter with only supported fields. Unknown fields fail
   validation at build time.
4. Import the MDX component and add it to the standard essay registry in
   `lib/mdx/essay-registry.ts`.
5. Use only topic slugs registered in `lib/topics/registry.ts`.
6. Run `npm run lint`, `npm run typecheck`, `npm run test`, and
   `npm run build`.
7. Verify the essay detail route, the Essays index, and sitemap behavior. Draft
   essays must not appear in public routes or the sitemap.
