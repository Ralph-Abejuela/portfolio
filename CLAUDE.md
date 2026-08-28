# aiportfolio — Ralph's manga-style portfolio

Astro 7 + Tailwind 4 (`@tailwindcss/vite`) + astro-icon + `@astrojs/sitemap`.
Deploy: **Cloudflare Pages** → <https://ralph-abejuela.pages.dev>. Site: astro.config.mjs `site`.

Identity: **dev portfolio in a manga/comic skin**. Content is a real fullstack-dev portfolio
(projects, DOST internship, skills, blog); the manga language is the costume. GEO
(Generative Engine Optimization) is a core requirement — JSON-LD, semantic HTML, per-page
meta, sitemap, `llms.txt`/`robots.txt` in `public/`.

## Development

```
astro dev --background     # start (AGENTS.md-wrapped background server)
astro dev stop|status|logs
```

Dev servers can go **STALE** (serve old content). If output looks wrong, check
`astro dev status`/restart, or verify against the **production build**:

```
pnpm astro build
python -m http.server 8090 --directory dist --bind 127.0.0.1   # serve dist (bind IPv4; `::`/localhost mismatch breaks)
```

Verify real rendering with pi-puppeteer (browser tool) against the prod build, not a stale dev server.

Docs: <https://docs.astro.build> (routing, components, content-collections, styling, i18n).

## Architecture

- Pages: `src/pages/index.astro`, `blog/index.astro`, `blog/[slug].astro` (pure composition).
- Section components: `src/components/` — Projects, Experience, Skills, Education, BlogTeaser,
  Interests, Contact, Hero, Nav, Footer, + primitives (SectionHeader, JobCard, ProjectCard,
  BlogCard, Chip, TagChip, ContactLink, Contact).
- Data: `src/data/*.ts` (site, projects, experience, skills, education, interests). **Content facts
  stay true; section copy/order may be restyled.**
- Blog: `src/content/blog/*.md` (3 posts). Article bodies are real content — don't rewrite.
- Styles: `src/styles/global.css` — the single design-system file (no per-component CSS).

Section order (#): Featured Works #01 > Experience #02 > Power List #03 (dark) > Education #04
(cyan) > Blog #05 > Extras #06 > Contact #07 (cyan climax, white cards) > cinematic footer
("The End.", fade to black).

## Design system — M3 color roles (theme)

Defined in `:root` (light) and `.dark, html:has(#theme-toggle:checked)` (dark). Roles
(m3.material.io/styles/color/roles style: every surface has an on- role):

| Role | Light | Dark |
| --- | --- | --- |
| primary (cyan) | #22d3ee | #22d3ee |
| on-primary (text on cyan) | #000 | #000 (constant) |
| surface (page bg) | #f9f9f9 | #0a0a0a |
| on-surface | #000 | #e5e5e5 |
| surface-container (cards) | #fff | #151515 |
| on-surface-container | #000 | #e5e5e5 |
| secondary-container (always-dark) | #1a1a1a | #1f1f1f |
| on-secondary-container | #f9f9f9 | #e5e5e5 |
| outline (borders) | #000 | rgba(255,255,255,.4) |
| shadow (hard offsets) | #000 | #e5e5e5 |
| surface-variant / on-surface-variant | #e5e5e5 / #474747 | #2a2a2a / white .7 |

`@theme inline` maps utilities → the vars so they flip at runtime: `bg-paper`→`var(--surface)`,
`text-ink`→`var(--on-surface)`, `bg-cyan`→`var(--primary)`, `border-ink`→`var(--outline)`,
`bg-night`/`text-moon` are **gone** → use `bg-secondary-container`/`text-on-secondary-container`.
Manga aliases `ink`,`paper`,`cyan` are kept (map to on-surface/surface/primary).

**All role/on-role pairs pass WCAG AA + AAA** (verified by script). Don't regress: `on-primary`
stays #000 (text on cyan readable in both themes), keep `--shadow` separate from text.

### CRITICAL theme gotchas

- **Every surface sets its own on- color.** `.panel { color: var(--on-surface-container) }` —
  without it, cards inside the cyan Contact section inherit `on-primary` and go **black-on-black
  in dark mode** (fixed bug).
- **Unlayered rule** (after all layers, beats Tailwind utilities layer):
  `.bg-cyan,.bg-accent,.panel-cyan,.hover\:bg-cyan:hover,.hover\:bg-accent:hover,.nav-a:hover,.nav-a[aria-current='page']{color:var(--on-primary)}`
  forces dark text on all accent surfaces.
- **Theme persistence** (2 tiny `is:inline` scripts in BaseLayout; supersedes the old "zero JS"):
  head script reads `localStorage['theme']` → toggles `dark` class on `<html>` pre-paint (no FOUC);
  body-end script syncs `#theme-toggle.checked` + persists. Icon swap CSS drives off
  `.dark`/`:has(#theme-toggle:checked)`. No persistence on the checkbox itself (JS handles it).

## Interactions (CSS scroll-driven, minimal JS)

- Reveal / bubble pop-in: `animation-timeline: view()` (`.reveal`/`.pop`). Zero JS.
- Hero parallax: layers use `animation-timeline: scroll(root)`, `animation-range: 0 900px`
  (`.plx`, `.plx-slow`).
- `prefers-reduced-motion` respected for pop-in + pulse-dot.
- **`view()` binds to the nearest scroll container** — an `overflow:hidden` ancestor freezes it.
  All section wrappers use **`overflow-clip`** (doesn't create a scroll container). Don't revert.
- **Hover consistency rule (r-san):** every interactive card/panel/button uses the `panel-hover`
  pattern — box-shadow **grows** (8→12px) + lifts (`translate(-4px,-4px)`) on hover, never shrinks.
  Speed-layer hover lines were removed from project cards. Contact cards = white panel + panel-hover.
- No screen-shake / custom cursor / page-transition JS (explicitly out of scope).

## Hero specifics

- Composed panel scene: `headshot.jpg` + SVG/CSS (halftone field, conic `speed-burst`,
  `splatter` data-URI, parallax layers). Headshot panel is `panel` with `corner-fold` removed
  (page-flip was removed by request). Oversized slashed title (`text-[clamp(2.75rem,10vw,6.5rem)]`),
  cyan strike bar on "Abejuela".
- "Available for work" badge: cyan chip (`bg-cyan text... on-primary`), `pulse-dot` (ink),
  rotation, hard shadow.
- Mobile: headshot first (`order-1`), `max-w-[10rem] sm:max-w-[13rem] md:max-w-full`, text centered
  (`text-center md:text-left`). Desktop headshot right (`md:order-2`, `md:col-span-5`,
  `md:ml-4 lg:ml-8`).
- Speed-line band at top uses **`mask-t`** (lines start at section top, fade down) — same for footer.

## Splatter

Organic manga ink burst SVG data-URI in `.splatter` (ragged core + tapered strokes + droplets).
Uses `background-size: contain; background-position: center` (without it the 320×240 SVG crops
in the smaller div — fixed bug). `.splatter-w` (`filter: invert(1)`) renders white ink on the
dark footer. Night mode inverts `.splatter:not(.splatter-w)`.

## Assets

- `public/images/headshot.jpg` — hero portrait (49KB).
- `public/images/headshot_manga.png` — footer blend experiment; committed asset (the Footer img
  was reverted by user; only the asset remains). `headshot_manga_white.png` was deleted.
- `src/assets/headshot-1bit.png` — **corrupt / fully transparent (A=0)**, unused. Don't use.
- Hero/blog images use the astro:assets `<Image>` component; public images are served raw
  (Lighthouse image-delivery insight — optional: move to src/assets for webp/avif optimization).

## Build / verification gotchas (Windows)

- **Lightning CSS minifies** output CSS: `0.7px→.7px`, `::before→:before`, `transparent→#0000`,
  `rgba(255,255,255,.4)→#fff6`, reorders props, and **folds `animation-timeline` into the
  `animation` shorthand** (e.g. `animation:linear both pop-in view()`). Grep dist for the
  *folded* form, not the source form.
- `rg dist/_astro/*.css` glob **fails on Windows** — use `rg ... dist/_astro -g "*.css"` or
  `Get-ChildItem ... | Select-Object -First 1` then read `.FullName`.
- `[slug].astro` breaks PowerShell path globbing (wildcard `[`) — use the `edit` tool, not
  `Get-Content "$p\..."`.
- `Set-Content -NoNewline` strips the trailing newline; `Add-Content`/`-NoNewline` to manage.
- astro-icon names live under `.icons` in `icons.json` (not top level); icons inline at build.
- `@tailwindcss/typography` is required for prose classes (`prose-manga`).
- `pnpm astro build` → inspect `dist/` (5 pages + `sitemap-index.xml`).

## Accessibility

- **Labels must have an associated control + text content.** Nav theme/menu toggles use
  `sr-only` spans (not bare `aria-label`). Don't reintroduce the `label-has-associated-control`
  violation.
- Alt text on all images; decorative texture divs are `aria-hidden`.

## Git

- Branch: `manga-design`. All commits **signed** (GPG `4757838B4A1082E1`, `commit.gpgsign=true`).
  Policy ladder: sign → if pinentry fails, prompt user → `--no-gpg-sign` only after 2nd failure.
  Never silently default to unsigned.
- Conventional messages: `feat|fix|style|chore|refactor(scope): ...`.
- `.pi/` and `.pi-glla/` are gitignored.

## Verification targets

- Prod build = Lighthouse **100/100/100/100** (perf, a11y, best-practices, SEO). Run Lighthouse
  against `dist`, never a stale dev server.
- Original goal contract checks (kept green): build exits 0; manga texture/panel classes present in
  dist CSS; cyan hex appears ≤12×; no old 1-Bit Tactile remnants (`86efac|dither|houndstooth`);
  JSON-LD script blocks remain; factual content strings present; `aria-hidden` ≥1.
