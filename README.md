# Ralph Luis Abejuela Portfolio

Static portfolio site for Ralph Luis Abejuela — fullstack developer, DOST Region V intern, Cum Laude BSIT graduate. Built with [Astro](https://astro.build) + Tailwind CSS 4.

## Tech stack

- **[Astro 7](https://astro.build)** — static site generation, zero-JS by default
- **Tailwind CSS 4** (via `@tailwindcss/vite`) + `@tailwindcss/typography` for prose
- **[shadcn](https://ui.shadcn.com)** — accessible modal/menu primitives (`class-variance-authority`, `clsx`, `tailwind-merge`)
- **astro-icon** + Tabler icons
- **JSON-LD** structured data (`Person`, `WebSite`, `BlogPosting`) + `llms.txt`

## Design language: Manga Panel

- **Comic/manga visual system** — every section is a framed panel: hard 3px ink borders, halftone dots, screentone, speed lines, and ink splatter textures layered under content.
- **Palette** — paper off-white / ink black, single cyan accent `#22d3ee` for tags, CTAs, and highlight panels. Full dark mode via CSS class + localStorage (no-FOUC inline script).
- **Typography** — heavy skewed display headings (`.display .skew`), black-weight uppercase micro-labels with wide tracking. Geist variable font.
- **Narrative structure** — sections numbered like chapters (01–07), "Fig." captions, "The End." footer. Portal-style number tags anchor each panel.
- **Depth** — hard offset shadows (`shadow-[3px_3px_0]`) and stacked-panel offsets instead of soft blurs; parallax halftone/speed-line layers with `prefers-reduced-motion` support.
- **Interactivity** — project cards open a shadcn modal with image gallery + lightbox (zoom, keyboard nav). No scroll hijacking.

## Pages

| Route | Description |
| --- | --- |
| `/` | One-page homepage: hero, projects, experience, skills, education, blog teaser, interests, contact |
| `/projects` | All projects index with modal detail view |
| `/blog` | Blog index |
| `/blog/[slug]` | Blog post (markdown via content collections) |
| `/404` | Custom not-found page (served with proper 404 status by Cloudflare Pages) |

## SEO / GEO

- Per-page canonical, OG, and Twitter tags; 1200×630 OG card (`public/images/og-default.png`, generated from `scripts/og-card.html`).
- JSON-LD: `Person` + `WebSite` on all pages, `BlogPosting` on posts.
- `sitemap-index.xml` + `robots.txt` + `llms.txt`.

## Commands

| Command | Action |
| --- | --- |
| `pnpm install` | Install dependencies |
| `pnpm dev` | Dev server at `localhost:4321` |
| `pnpm build` | Build production site to `./dist/` |
| `pnpm preview` | Preview the production build |

## Content

- Blog posts: `src/content/blog/*.md` (frontmatter: `title`, `description`, `pubDate`, `tags`).
- Site data (name, email, socials, skills): `src/data/site.ts`.
- Project data: `src/data/projects.ts`.
- Headshot: `public/images/headshot.jpg` (face-cropped, 800×800, ~50KB).
- OG card: edit `scripts/og-card.html`, then re-render with Edge headless:
  `msedge --headless=new --window-size=1200,630 --screenshot=public/images/og-default.png <file-url-of-og-card.html>`

## Deploy to Cloudflare Pages

1. Push this repo to GitHub.
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git** and pick the repo.
3. Build settings:
   - Build command: `pnpm build`
   - Build output directory: `dist`
   - Node version: `22` (see `engines` in package.json)
4. Deploy. `site` in `astro.config.mjs`, `robots.txt`, and `llms.txt` already point at the production domain (`ralphabejuela.com`).

## Project structure

```text
/
├── public/
│   ├── images/               # headshot, og-default.png
│   ├── favicon.svg           # RA monogram
│   ├── robots.txt
│   └── llms.txt
├── scripts/
│   └── og-card.html          # OG image source template
├── src/
│   ├── assets/               # project screenshots (webp via astro:assets)
│   ├── components/           # Hero, Projects, Footer, BlogCard, …
│   ├── content/blog/*.md     # blog posts
│   ├── data/site.ts          # site-wide data (name, socials, skills)
│   ├── data/projects.ts      # project entries
│   ├── islands/              # interactive components: ProjectModal, ThemeToggle, MobileMenu
│   ├── layouts/BaseLayout.astro
│   └── pages/
│       ├── index.astro
│       ├── projects.astro
│       ├── 404.astro
│       └── blog/
└── astro.config.mjs
```
