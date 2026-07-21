# Demo Integration

`DFATPUNK/personal-website` owns `jeremybrunet.com`.

`DFATPUNK/demos` owns `demos.jeremybrunet.com` and currently routes to separate demo deployments.

The PR 1 foundation does not modify `DFATPUNK/demos`, reverse-proxy demo apps, or move demo source code into the personal website.

## Routes Observed During Audit

- Parameter Golf Calculator
- Zero-Touch Onboarding / Alan
- Balatro Joker Generator

The demos hub UI and `vercel.json` currently use slightly different route labels for some demos. Resolve canonical paths during the demos PR before creating a final typed catalog.

## Future Options

- Keep `demos.jeremybrunet.com` permanently.
- Link from `jeremybrunet.com/demos` to external demo deployments.
- Add `/demos/[slug]` landing pages.
- Redirect selected `/demos/[slug]` routes.
- Reverse-proxy selected demos only after reviewing asset paths, APIs, cookies, CORS, and Vercel rewrites.
- Move selected demos into the main app after a separate migration decision.
