# Dependency Audit

Audit date: 2026-07-21

Commands run:

- `npm audit`
- `npm audit --omit=dev`
- `npm outdated`

## Updates applied

A narrow non-major update was applied for the Next.js and ESLint stacks:

- `next` to `15.5.21`
- `@next/mdx` to `15.5.21`
- `eslint-config-next` to `15.5.21`
- `postcss` to `8.5.21`
- `eslint` to `9.39.5`
- `@eslint/js` to `9.39.5`
- `typescript-eslint` to `8.65.0`

No automatic `npm audit fix` or major framework upgrade was run.

## Production/runtime findings

`npm audit --omit=dev` reports one moderate advisory path:

- `next` depends on bundled `postcss <8.5.10`.
- The audit-suggested fix is `npm audit fix --force`, which would install an
  incompatible old Next.js version according to npm's output.
- No high or critical production/runtime vulnerability is reported.
- This is deferred because the available audit fix is not a safe narrow patch or
  minor update for this PR.

## Development-only findings

`npm audit` reports remaining development-only transitive advisories through
lint/test tooling:

- `brace-expansion`: high, transitive, safe fix reported through `npm audit fix`.
- `flatted`: high, transitive, safe fix reported through `npm audit fix`.
- `picomatch`: high, transitive, safe fix reported through `npm audit fix`.
- `rollup`: high, transitive, safe fix reported through `npm audit fix`.
- `vite`: high, transitive through Vitest tooling, safe fix reported through
  `npm audit fix`.

These do not affect the deployed static Next.js site at runtime. They are
deferred because PR 6 avoids broad automatic audit rewrites and major tooling
changes.

## Outdated packages

`npm outdated` still reports newer non-major releases for several development
and UI packages, plus major releases for Next.js, React-related types, ESLint,
TypeScript, Vitest, Zod, and others.

These are not release blockers by themselves. Do not update dependencies solely
to silence `npm outdated`; future updates should be scoped and tested.
