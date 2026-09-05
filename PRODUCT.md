# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: recruiters and hiring managers at PH companies and remote-first teams hiring junior-to-mid fullstack developers. They scan fast (seconds per portfolio), then either click GitHub/resume or leave. Secondary: developers evaluating collaboration signal via GitHub and blog writing.

## Product Purpose

A personal portfolio that converts a scan into an interview: prove Ralph Abejuela ships real, complete software with genuine engineering depth. Success = recruiter contacts him / opens his repo or resume.

## Positioning

The fullstack developer whose products keep user data on the user's device: ejobtrack runs Gmail parsing and ML inference entirely in the browser with no backend to breach. This thesis is a binding brand commitment (confirmed by the user). Neighboring junior portfolios cannot truthfully claim production on-device ML plus a deliberate Google restricted-scope compliance decision.

## Operating Context

- Deployed on Cloudflare Pages at <https://ralphabejuela.com> (GitHub Pages-style static output; sitemap + JSON-LD).
- The blog is part of the evaluation signal: long-form, first-person engineering narratives (GEPA eval run, Google verification saga, local LLMs).
- Resume (PDF) and GitHub are the primary click-through destinations after the portfolio.
- Commits are GPG-signed; conventional commit messages.

## Capabilities and Constraints

- Astro + Tailwind static site; interactions are CSS scroll-driven with near-zero JavaScript by design.
- **Lighthouse 100/100/100/100 (perf, a11y, best-practices, SEO) against the production build is a hard requirement.** Visual changes must not regress it. Verified against `dist/`, never a dev server.
- ejobtrack declined Google's paid annual CASA security assessment deliberately (architecture makes it moot); this is a told story, not a failure to hide.
- DOST Region V backend internship: DOST-funded intern, not a DOST scholar. Never describe him as a scholar.
- Open/undecided: which project fills the "multi-user/backend scale" gap (parser npm library vs. backend system) — record once decided.

## Brand Commitments

- Name: Ralph Luis Abejuela ("Ralph" in nav/footer).
- Privacy-first, on-device-ML thesis is binding for all future copy and project framing.
- Real assets only: headshot.jpg (graduation portrait, sash), real project screenshots. No fabricated testimonials, metrics, or logos.

## Evidence on Hand

- ejobtrack: live at ejobtrack.ralphabejuela.com, open source (github.com/Ralph-Abejuela/ejobtrack), real dashboard screenshot (`src/assets/projects/ejobtrack-og.png`), 50+ ATS parsers, OAuth, on-device Transformers.js classifier.
- Agri-Connect: deployed government warehouse system (Albay), 4 real screenshots, CI/CD story.
- Tagisan ng Talino: campus 1st, cluster 2nd (2024), event photos + certificate.
- Blog: 3 real posts with real numbers (0.725→0.825 GEPA scores, 360 listings/214 companies, RX 6800 token rates).
- Absences future work must not fabricate: ejobtrack user counts, parse-speed benchmarks, testimonials, salary/revenue figures.

## Product Principles

1. Evidence over claims: every statement traceable to a repo, deployment, or post.
2. Benefit-first copy: architecture facts translated into user outcomes ("your data never leaves your device"), never buzzword lists.
3. Scan-speed hierarchy: ejobtrack dominates; everything else supports.
4. One accent, one voice: cyan as the single color-insert; honest first-person tone everywhere.
5. Honest limits: declined assessments, plateaued runs, and failures are told as engineering judgment.

## Accessibility & Inclusion

WCAG AA minimum, AAA for body text color pairs (role/on-role pairs verified). Lighthouse a11y 100 is part of the hard requirement. Labels always have associated controls and text; decorative textures are aria-hidden.
