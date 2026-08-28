# aiportfolio — Ralph Luis Abejuela

Static portfolio site for Ralph Luis Abejuela — backend developer, DOST Region V intern, Cum Laude BSIT graduate. Built with [Astro](https://astro.build) + Tailwind CSS.

## Design goals

- **Light clean minimal** — emerald accent, system fonts, no client-side frameworks.
- **Zero external JS** — one small inline script for reveal-on-scroll and active-nav highlighting. No scroll hijacking.
- **GEO/SEO friendly** — JSON-LD structured data (Person, BlogPosting, WebSite), semantic HTML, quotable content, per-page meta + Open Graph, `sitemap-index.xml`, `robots.txt`, and `llms.txt` for LLM/AI-platform citation.

## Pages

| Route | Description |
| --- | --- |
| `/` | One-page homepage: hero, experience, skills, projects, education, interests, blog teaser, contact + socials |
| `/blog` | Blog index |
| `/blog/[slug]` | Blog post (markdown via content collections) |

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
- Headshot: `public/images/headshot.jpg` (face-cropped, 800×800, ~50KB — reprocess with the OpenCV script if you change photos).

## Deploy to Cloudflare Pages

1. Push this repo to GitHub.
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git** and pick the repo.
3. Build settings:
   - Build command: `pnpm build`
   - Build output directory: `dist`
   - Node version: `22` (see `engines` in package.json)
4. Deploy. Update `site` in `astro.config.mjs` (and `robots.txt`/`llms.txt` URLs) to your real domain once assigned.

## Project structure

```text
/
├── public/
│   ├── images/headshot.jpg
│   ├── robots.txt
│   ├── llms.txt
│   └── favicon.*
├── src/
│   ├── content/blog/*.md       # blog posts
│   ├── data/site.ts            # site-wide data
│   ├── layouts/BaseLayout.astro
│   ├── pages/index.astro       # homepage
│   ├── pages/blog/index.astro
│   └── pages/blog/[slug].astro
└── astro.config.mjs
```
