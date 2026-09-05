---
name: Ralph Abejuela Portfolio
description: Manga-print portfolio for a privacy-first fullstack developer — ink panels, halftone texture, one cyan color-insert accent.
colors:
  color-insert-cyan: "#22d3ee"
  ink: "#000000"
  paper: "#f9f9f9"
  panel-white: "#ffffff"
  night-panel: "#1a1a1a"
  halftone-grey: "#e5e5e5"
  pencil-grey: "#474747"
  alert-red: "#dc2626"
typography:
  display:
    fontFamily: "Arial Black, Inter, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "clamp(2.75rem, 11vw, 7.5rem)"
    fontWeight: 900
    lineHeight: 0.88
    letterSpacing: "normal"
  headline:
    fontFamily: "Arial Black, Inter, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "clamp(1.5rem, 4vw, 2.25rem)"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "normal"
  body:
    fontFamily: "Geist Variable, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "Arial Black, Inter, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "0.68rem"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "0.1em"
rounded:
  none: "0"
spacing:
  gutter: "1rem"
  section: "4rem"
  container: "72rem"
components:
  button-primary:
    backgroundColor: "{colors.color-insert-cyan}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.6rem 1.15rem"
  button-secondary:
    backgroundColor: "{colors.panel-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.6rem 1.15rem"
  panel-card:
    backgroundColor: "{colors.panel-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
  night-panel:
    backgroundColor: "{colors.night-panel}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
  tag-label:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
---

# Design System: Ralph Abejuela Portfolio

## Overview

**Creative North Star: "Ink Panel Manga"**

The site is a printed manga volume rendered in a browser. Every surface is a panel: a flat card cut from thick black ink (3px borders, zero radius), lifted off the page by solid offset shadows instead of blurs. Halftone dots, speed lines, conic bursts, and an SVG ink splatter are the print texture; they are always decorative, always `aria-hidden`, and never sit under body text. Each chapter (section) carries a numbered tag like a manga chapter marker, and the footer is the volume's back cover: "The End." fading to black.

Color behaves like manga printing: the whole book is black ink on paper, and cyan exists the way a color insert page exists in a printed volume — rare, loud, and load-bearing when it appears. One accent (#22d3ee) is used across the entire site in both themes; its scarcity is what makes it read as "power" rather than decoration. Dark mode is the same book at night: ink and paper swap roles through CSS custom properties, and every surface restates its own text color so nothing inherits the wrong ink.

Interaction is physical: cards tilt (`skewX(-7deg)`), buttons press in on click (shadow collapses to 0), hover lifts a panel up-and-left while its hard shadow grows. Motion is CSS scroll-driven (`animation-timeline: view()` / `scroll(root)`) with near-zero JavaScript, collapses under `prefers-reduced-motion`, and no animation exists without a print-physics reason.

**Key Characteristics:**

- 3px ink borders + solid hard-offset shadows (never blurry) on every surface
- Zero border-radius anywhere; `skewX(-7deg)` is the form language
- One cyan accent, used like a printed color-insert page
- Decorative print textures (halftone, speed-lines, splatter) always `aria-hidden`
- Chapter-number tags + "The End." cinematic footer
- Dark mode via CSS variable role swap, theme persisted pre-paint

## Colors

The palette is print-shop simple: black ink, paper white, three grey steps for texture, and a single electric cyan reserved for emphasis. Dark mode is a role swap of the same ink, not a separate palette.

### Primary

- **Color Insert Cyan** (#22d3ee): the one accent. CTAs ("Contact Me"), the availability badge, hovered nav links, the featured project's top bar, links in prose, selection highlight. On cyan surfaces text is always black ink (#000000) in both themes. Cyan appears on roughly one element per viewport — its rarity is the point.

### Secondary (optional; omit if the project has only one accent)

- **Night Panel** (#1a1a1a light / #1f1f1f dark): the "always-dark" print stock. Footer, dark cards, secondary buttons, code blocks. Text on it is paper (#f9f9f9 / #e5e5e5) regardless of theme.

### Tertiary (optional)

- **Alert Red** (#dc2626 light / #f87171 dark): destructive actions only. Never decorative.

### Neutral

- **Ink** (#000000 light / #e5e5e5 dark): text and 3px borders. Borders and text swap together in dark mode.
- **Paper** (#f9f9f9 both themes): page background.
- **Panel White** (#ffffff light / #151515 dark): card/panel surfaces.
- **Halftone Grey** (#e5e5e5 light / #2a2a2a dark): muted surfaces, texture dots, dividers.
- **Pencil Grey** (#474747 light / rgba(255,255,255,0.7) dark): secondary text.

### Named Rules (optional, powerful)

**The Color-Insert Rule.** Cyan is the only accent and is rationed to emphasis moments: primary CTA, availability badge, featured-work bar, hover states. Never two competing accents; never cyan as large background except the Contact section, which is the deliberate full-bleed color insert of the volume.

**The On-Ink Rule.** Every surface restates its own text color. Text on cyan is always #000000 (both themes); text on Night Panel is always paper. No surface inherits its parent's ink — this is what keeps the dark theme black-on-black-proof.

## Typography

**Display Font:** Arial Black (fallback: Inter, Helvetica Neue, Helvetica, Arial) — system-loaded, zero webfont cost for display
**Body Font:** Geist Variable (self-hosted via @fontsource-variable, `font-display: swap`)
**Label/Mono Font:** Arial Black at micro sizes with wide tracking (no separate mono)

**Character:** A heavy print voice: display type is 900-weight, uppercase, and tightly led (0.88 line-height) like manga title lettering, while body copy is a quiet geometric sans at 500. Hierarchy is built from weight, case, and size contrast — never from thin weights or serif injections.

### Hierarchy

- **Display** (900, clamp(2.75rem, 11vw, 7.5rem), 0.88): hero name, section headlines, "The End." Always uppercase, usually skewed -7°.
- **Headline** (900, clamp(1.5rem, 4vw, 2.25rem), 1.0): card/project titles, panel headings.
- **Title** (900, 1.25–1.5rem, 1.0): sub-headlines inside panels.
- **Body** (500, 1rem, 1.625): paragraphs and list points inside panels; max width ~65ch.
- **Label** (900, 0.65–0.7rem, 0.1em tracking, uppercase): tags, dates, stack lines, eyebrows. The smallest type is the loudest-shaped.

### Named Rules (optional)

**The Heavy Type Rule.** If it's display or label, it's 900 and uppercase. Hierarchy comes from size and case contrast, never from thin weights, letter-spaced light text, or serif imports. No serif faces anywhere on the site.

## Layout

Single-column scroll of stacked full-width sections, each a bordered "chapter" separated by 3px ink rules (`border-b-[3px] border-ink`). Content lives in a `max-w-6xl` (72rem) centered container with `px-4` gutters; section vertical rhythm is `py-16` (4rem). Inside sections, composition is a 12-column grid with asymmetric splits (hero 7/5, featured works 12 → 7/5) that collapse to a single ordered column below 768px — on mobile the hero image leads (`order-1`) and text centers.

Density is medium: panels are close enough to read as a printed page (gap-3 grids), but body copy inside panels keeps generous line-height. Decorative texture layers are absolutely positioned behind content (`z-0` vs content `z-10`) and faded with mask gradients so they never reduce text contrast.

**The Overflow-Clip Rule.** Section wrappers use `overflow-clip`, never `overflow-hidden` — hidden creates a scroll container that freezes CSS scroll-driven animations (`view()` binds to the nearest scroller). Do not revert.

## Elevation & Depth

Depth is structural, not ambient: every panel casts a solid black offset shadow (8px 8px 0) like a sticker lifted off the page. There are no blurry shadows anywhere. In dark mode the shadow ink flips to light (#e5e5e5) so the lift stays visible. Interaction changes the shadow's size, never its softness.

### Shadow Vocabulary (if applicable)

- **Panel rest** (`box-shadow: 8px 8px 0 var(--shadow)`): default state of every panel/card/button-container.
- **Hover lift** (`transform: translate(-4px,-4px)` + `box-shadow: 12px 12px 0 var(--shadow)`): interactive cards move up-left while the shadow grows — the shadow always grows on hover, never shrinks.
- **Press** (`box-shadow: none` + translate toward the shadow): buttons on `:active` collapse flat, simulating being pressed into the page.

### Named Rules (optional)

**The Hard-Offset Rule.** Shadows are solid offset blocks (`Npx Npx 0 var(--shadow)`), never blurred, never tinted ambience. If a design wants softness, it's the wrong design system.

## Shapes

Zero border-radius across the entire system (`--radius: 0`) — corners are right angles everywhere, and "shape interest" comes from three moves instead: the global -7° skew on display type and buttons, occasional clipped corners via `clip-path` (`panel-cut`, `panel-cut-tr` — a notched corner like a cut page), and slight rotations (-2° to -6°) on badges and stamps. Borders are uniformly 3px ink on panels and 2px on small elements (badges, chips, gallery tiles). Iconography is a single family (Tabler, stroke-based) at 13–16px.

## Components

For each component, lead with a short character line, then specify shape, color assignment, states, and any distinctive behavior.

### Buttons

- **Shape:** zero radius, 3px ink border, hard shadow, whole button skewed -7° (contents counter-skewed +7° so text stays upright)
- **Primary:** Color Insert Cyan (#22d3ee) background, black ink text, padding 0.6rem 1.15rem
- **Secondary / Ghost:** Panel White background, ink text; dark variant uses Night Panel stock
- **Hover / Focus:** shadow grows 5px→10px with a -2px,-2px shift; `:active` collapses shadow to none and translates 5px,5px (press-in); focus-visible is a 2px cyan outline offset 2px

### Chips (if used)

- **Style:** 2px ink border on Paper, 900-weight uppercase micro-labels; the "available for work" badge variant is cyan with a pulsing ink dot and -2° rotation
- **State:** static by default; hover fills cyan with ink text (social link chips)

### Cards / Containers

- **Corner Style:** zero radius, 3px ink border
- **Background:** Panel White (theme-swapped); dark variant Night Panel
- **Shadow Strategy:** 8px 8px 0 at rest; interactive cards follow Hover lift (see Elevation)
- **Border:** 3px ink; interactive cards switch border-color to cyan on hover/focus with a cyan 4px top bar scaling in (`project-card`)
- **Internal Padding:** 1.5rem (p-6) to 1.75rem (p-7)

### Navigation

- Sticky top bar, Panel White on ink border-bottom, "RALPH." wordmark chip in cyan
- Links: 900-weight uppercase; hover/current page fills cyan with ink text (`nav-a`)
- Mobile: hamburger island (React) with slide-over menu

### Speech Bubble (signature component)

- **Style:** 2.5px ink border, 18px radius (the one intentional roundness — a manga speech balloon), 5px 5px 0 shadow, tail drawn with stacked CSS triangles
- **Use:** hero tagline, testimonials; dashed variant (`bubble-q`) for thought balloons
- **State:** none — static print object; `pop` animation on scroll entry

### Print Textures (signature layer)

- **Vocabulary:** halftone dot fields (16px/28px grids), horizontal speed lines, conic speed-burst, SVG ink splatter (organic core + tapered strokes + droplets), screentone stripes
- **Rules:** always `aria-hidden`, always behind content, always masked (fade via `mask-r/b/t/burst`), inverted for white-on-dark, removed in print media and under `prefers-reduced-motion` parallax freezes

## Do's and Don'ts

### Do

- **Do** keep every text color paired to its surface via the on-roles (on-primary #000, on-secondary-container paper) — both themes, WCAG AA minimum, AAA body.
- **Do** use `overflow-clip` on section wrappers so scroll-driven animations keep working.
- **Do** grow the hard shadow on hover (8→12px) with a lift; interactive panels must feel like they rise.
- **Do** mark all texture layers `aria-hidden` and remove them in print output.
- **Do** use the chapter-tag pattern (numbered `tag` + skewed display headline) for new sections.
- **Do** run `pnpm astro build` and Lighthouse against `dist/` — the 100×4 bar is part of the system.

### Don't

- **Don't** introduce a second accent color, a soft/blurry shadow, or a non-zero border-radius.
- **Don't** put anything but black ink (#000000) on cyan surfaces, in either theme.
- **Don't** use `overflow-hidden` on section wrappers (freezes `animation-timeline: view()`), and don't re-add screen-shake, custom cursors, or page-transition JS — all explicitly out of scope.
- **Don't** let decorative textures sit under body text or without `aria-hidden`.
- **Don't** import serif faces or thin-weight display type; hierarchy is 900-weight uppercase vs Geist body.
- **Don't** reintroduce remnants of the old "1-Bit Tactile" theme (#86efac greens, dither, houndstooth patterns).
