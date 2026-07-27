# MatX Visual Audit

PR 10 audited `https://matx.com/` and the local `v2` site with headless
Chromium through the Chrome DevTools Protocol. MatX was checked at 390 px,
1280 px, and 1440 px. The local site was checked before and after the PR at the
same widths, with responsive QA also run at 320 px, 390 px, 768 px, 1024 px,
1280 px, and 1440 px.

MatX computed styles were cross-checked against its public `styles.css` because
the site is static and exposes the relevant font, color, spacing, and layout
declarations there.

## Comparison

| MatX | jeremybrunet.com before PR 10 |
|---|---|
| Body background computed as `#ffffff`. | Body background computed as `#fbfaf7`. |
| Primary text computed as `#1a1a1a`; secondary text uses `#3a3a3a`; tertiary/footer text uses `#666666`. | Primary text computed as `#171717`; muted text as `#67635c`. |
| Computed font family is `Unica77, "Helvetica Neue", Helvetica, Arial, sans-serif`. Font resources are private MatX-hosted `/static/fonts/unica/*.woff2` files. | CSS claimed `Inter`, but the app did not load Inter; computed stack fell through to `Inter, ui-sans-serif, system-ui, ...`. |
| Body font computed as 15 px with 22.5 px line height. | Body font computed as 16 px with 24 px line height. |
| Home heading computed as 36 px / 400 / 39.6 px line height at desktop, and 26 px / 400 / 31.2 px at 390 px. | Page title computed as 24 px / 600 / 30 px at desktop and mobile. |
| Home row labels use 12 px, 400 weight, uppercase, about `0.06em` tracking, and `#3a3a3a`. | Section headings used 14 px, 600 weight, uppercase, about `0.14em` tracking, and `#67635c`. |
| Content column computed as 800 px at 1280 px and 1440 px; about 358 px at 390 px. | Content column computed as 560 px at desktop; about 350 px at 390 px. |
| Sidebar width computed as 260 px at desktop; mobile uses a fixed top navigation. | Sidebar width computed as 220 px at desktop; mobile uses the existing top navigation. |
| Desktop main padding computed as 85 px top, 40 px left, 80 px right. At 390 px MatX main padding computed as 90 px top and 16 px sides. | Desktop main padding computed as 64 px top and 40 px sides. At 390 px it used 32 px top and 20 px sides below the mobile header. |
| Home rows use 20 px vertical padding, 140 px label column, 20 px gap, and 1 px `#dddddd` top dividers. | Sections used 32 px vertical padding and 1 px `#d7d2c8` bottom dividers. |
| Footer uses 13 px text at desktop, 12 px at 390 px, `#666666`, 1 px `#eeeeee` top border, 40 px top padding desktop, and 16 px icons. | Footer used 14 px text, `#67635c`, 1 px `#d7d2c8` top border, 24 px top padding, and 18 px icons. |
| Links are mostly neutral: navigation links have no underline; body links use underlines or 1 px neutral bottom borders; hover moves toward primary text. | Links used inherited color globally, accent hover, and several accent-colored links. |

## Font Decision

MatX uses Unica77 and Unica77 Mono through private hosted font files. Those files
were not copied or committed. Because the exact font source is private/ambiguous
for reuse, this PR selects Geist and Geist Mono through `next/font/google`.
Geist is freely available through the approved Next.js font integration, is
self-hosted by the build, and gives the site a deterministic sans/mono stack
without a remote runtime font dependency.

## Final Changes Selected

- Changed the global background to white and moved neutral tokens toward MatX:
  `#1a1a1a`, `#3a3a3a`, `#666666`, `#eeeeee`, and `#dddddd` row dividers.
- Preserved the existing accent variables for links, focus, and status UI:
  `--accent: #265d73` and `--secondary-accent: #8d3434`.
- Loaded Geist/Geist Mono with `next/font/google` and removed the unfulfilled
  Inter font claim.
- Set body text to 15 px / 1.5 and adjusted prose, page descriptions, and item
  typography to a quieter MatX-like scale.
- Increased page title presence to 36 px desktop and 26 px mobile, with normal
  weight and safe wrapping.
- Changed section rows to a MatX-like desktop grid: 140 px label column, 20 px
  gap, 20 px vertical padding, top divider, 12 px normal-weight uppercase label,
  and reduced tracking.
- Expanded the content column to 800 px and the desktop sidebar to 260 px, with
  a 1400 px max layout and MatX-like desktop page padding.
- Kept bordered tags and made their text/borders neutral; no `#` prefixes and
  no filled pills were introduced.
- Kept the desktop sidebar, mobile navigation behavior, route structure, career
  hierarchy, demo behavior, essay publication behavior, contact validation, and
  footer content.
- Adjusted footer typography, color, spacing, and icon size to the new neutral
  system while retaining Contact/Mail, GitHub, and LinkedIn.

## Screenshots

- `docs/screenshots/pr10-about-desktop.png`
- `docs/screenshots/pr10-about-mobile.png`
- `docs/screenshots/pr10-essays-desktop.png`
- `docs/screenshots/pr10-demos-desktop.png`
- `docs/screenshots/pr10-contact-mobile.png`
- `docs/screenshots/pr10-footer-desktop.png`
- `docs/screenshots/pr10-footer-mobile.png`
- `docs/screenshots/pr10-testimonials-long.png`
- `docs/screenshots/pr10-not-found.png`

## QA Notes

Responsive Chromium QA covered `/`, `/essays`, `/demos`, `/demos/alan`,
`/demos/mlp`, `/contact`, and a custom 404 path at 320 px, 390 px, 768 px,
1024 px, 1280 px, and 1440 px. Each route reported no global horizontal
overflow (`scrollWidth === clientWidth`), a present heading, a present footer,
and 16 px footer icons.

The only local standard essay fixture is `foundation-sample`, which is a draft
and must remain non-public, so no public standard essay route was audited.

Accessibility-preserving choices kept semantic headings, the skip link,
visible focus outlines, keyboard navigation structure, link text, form labels,
error associations, reduced-motion rules, neutral-but-visible tag borders, and
non-color-only status text.
