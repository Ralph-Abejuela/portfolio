---
title: "ejobtrack: The Zero-Server Job Tracker That Fought Google Verification"
description: "The full story of building ejobtrack — a browser-only job tracker that parses Gmail with OAuth 2.0, regex parsers for 50+ ATS platforms, and on-device Transformers.js ML. Including the 429 rate-limit war, the two-pass sync bug, and the Google verification saga that ended in a paid annual security assessment I chose to decline."
pubDate: 2026-07-20
tags: ["React", "TypeScript", "Gmail API", "Transformers.js", "IndexedDB"]
---

**ejobtrack is a zero-server job application tracker.** It connects to your Gmail inbox (read-only), parses application statuses from LinkedIn, Indeed, and 50+ applicant tracking systems, and builds a dashboard with status timelines, duplicate detection, and merge/undo — with no backend anywhere. Tokens, email data, and ML inference never leave the browser. You can verify that claim in DevTools, which is the point.

This is the full story: the architecture decision, the three ways it fought back, and the Google verification saga that taught me more about shipping OAuth apps than any tutorial.

## Why zero-server at all

Most job trackers store your data on their servers, which means trusting a stranger's database with the most sensitive inbox you own. ejobtrack takes the opposite position:

- **No backend to maintain, scale, or pay for.** The app is static files on Cloudflare Pages.
- **Storage is IndexedDB** (via Dexie.js): parsed jobs, a 10,000-email cache with eviction, and a dedup index — all namespaced per Google account.
- **Auth tokens live in sessionStorage**, restored on reload, silently refreshed on 401, and gone when the tab closes.

Zero-server isn't free, though. Every problem a server would normally absorb — rate limiting, sync correctness, background jobs — becomes a client-side engineering problem. The rest of this post is about the three times that tradeoff bit me.

## Fight #1: Gmail rate limits and the retry queue

Gmail's API returns HTTP 429 when you poll too eagerly, and a first sync means fetching your entire application-related inbox. The naive fix — retry immediately — just burns more quota.

The fix that stuck has three parts:

1. **A retry queue persisted to localStorage** — rate-limited email IDs survive page reloads.
2. **Exponential backoff** — a background loop polls the queue every 10 seconds and retries at 30s → 2min → 10min → 30min intervals.
3. **One shared ingestion pipeline** — both the live poller and the retry loop funnel through the same `ingestEmail()` function: parse → ignore-list check → ML classification → dedup → store. Two code paths for one pipeline is how duplicates get born.

The subtlest bug was sync correctness on "Load More." Walking pages of 25 emails in both directions sounds trivial until you ask: what happens if new mail arrives mid-crawl? The final design anchors each forward crawl at a timestamp captured *before* the fetch, walks pages until it hits an already-scanned email (the anchor is always scanned, so termination is guaranteed), and caps runaway walks at 50 pages. Backward sync uses Gmail's `nextPageToken` — which expires in 2 hours — with a `before:date` query fallback. Every edge case there was found by a test, not by a user, and the tests run against scrubbed copies of my real job-application emails.

## Fight #2: classification when regex isn't enough

The parsing core is a registry of platform-specific parsers — each declares the sender addresses it owns, subject-line patterns that mark non-job mail, and a function that extracts company, role, and status. A generic fallback parser scores any unrecognized email with keyword matching. The ignore-list check alone has three matching modes, because sender headers are messy: full-header regex for pattern entries, header regex for strings containing spaces (a plain substring heuristic misclassifies `'John Doe <invitations@linkedin.com>'`), and plain substring on the extracted address otherwise.

But 50+ parsers still miss long-tail senders. The fallback for those is **machine learning running in the browser**: a HuggingFace email classifier loaded through Transformers.js, lazy-loaded on first use, running inference on-device with WebAssembly. Four labels — confirmation, rejection, interview, offer — decide whether an unknown sender is worth parsing.

The failure mode here was delightful: in Vite dev mode, requests for the model's local files returned HTML (the SPA fallback), which the library cached — corrupting every subsequent load. The fix: force remote model resolution with `env.allowLocalModels = false` and delete the `transformers-cache` on load errors. That one cost an afternoon.

## Fight #3: the Google verification saga

Using the Gmail API beyond test users requires Google's verification — and `gmail.readonly` is a **restricted scope**, the strictest tier Google has. Two rounds of review emails followed, each one a masterclass in reading a spec.

**Round one: the app-name mismatch.** The reviewer said the OAuth consent screen didn't match my site branding. Everything local and deployed showed exactly `ejobtrack` — h1, header, tab title. After eliminating the obvious, the suspect became the `<title>` tag: `ejobtrack — Automatic Job Application Tracker`. If the checker does an exact-string compare, a tagline breaks it. I made the title exactly `ejobtrack` and wrote a point-by-point appeal with screenshots of the consent screen and the home page showing the identical string.

**Round two: the privacy policy.** The next rejection listed three missing disclosures, verbatim: what Google user data is accessed, how it's used, and what protects it. My reply-to-confirm email answered each one concretely:

- **Data access** — the exact `gmail.readonly` scope, field by field: email metadata and headers (sender, recipient, date, subject), snippets, message bodies fetched only when a user expands an email, and the account address — plus an explicit list of what is *never* touched (Gmail settings, other Google products, other accounts).
- **Data use** — solely to identify job applications and track status changes (received, viewed, interview, offer, rejection); never advertising, never sold, never shared, never used to train AI or ML models.
- **Data protection** — the zero-server architecture became the argument: there is no backend to breach, all data lives in the browser's IndexedDB, everything moves over HTTPS/TLS, ML runs on-device, analytics are SHA-256 hashed, and users can revoke access from their Google Account at any time. On top sits the **Limited Use disclosure** Google requires for restricted scopes — the contractual promise that human reviewers won't read user data.

That reply cleared the policy review. Then came round three, and the real decision: for restricted scopes, Google requires an **annual ADA-CASA AL1 security assessment** — a paid audit by an authorized third-party lab, typically 2–6 weeks, quoted per engagement, renewable every year. For a solo, free, zero-server tool, that's a recurring enterprise-grade cost guarding data that never leaves the user's browser in the first place.

I stopped there, deliberately. Not because the audit is unreasonable — it exists because most apps *do* ship your data to servers — but because it's the wrong trade for this architecture. The honest ending of a zero-server story is that the same design that protects users also means Google's compliance regime (built for apps that see your data centrally) has nothing cheap to offer an app that doesn't. Verification stays unfinished; the app keeps working, with Google's unverified-app warning in front of new sign-ins. If ejobtrack ever grows a backend, CASA comes with it — that's the deal.

The meta-lessons: **compliance rejections are specs** — every email listed concrete, checkable requirements, and answering them like failing tests worked every time. And **knowing when to stop is part of shipping** — the verification process is priced for companies, and pretending otherwise would have turned a fun tool into a liability.

## What it taught me

1. **"No backend" doesn't mean "no backend problems."** It means you inherit rate limiting, sync, and reliability as client-side code.
2. **One pipeline, many entry points.** Poller and retry loop sharing `ingestEmail()` is the single best decision in the codebase.
3. **Anchor-based sync beats "fetch everything new"** the moment correctness matters more than simplicity.
4. **On-device ML is practical** — a small classifier in the browser handles the long tail without a server round-trip, as long as you know the caching gotchas.
5. **Compliance rejections are specs.** Read them like failing tests — exact strings, exact fields, resubmit.
6. **Architecture choices decide your compliance bill.** A zero-server app has nothing for an auditor to assess — which is exactly why the audit felt absurd, and why declining it was the right scope call.

ejobtrack is open source at [github.com/Ralph-Abejuela/ejobtrack](https://github.com/Ralph-Abejuela/ejobtrack) and lives at [ejobtrack.ralphabejuela.com](https://ejobtrack.ralphabejuela.com). It's also the origin story for my next project — a server-side companion that attacks the same job-hunt pain from the opposite direction.

## Resources

- [ejobtrack](https://github.com/Ralph-Abejuela/ejobtrack) — the repo; parser PRs welcome, the registry is built for it
- [Transformers.js](https://huggingface.co/docs/transformers.js) — on-device inference in the browser
- [Dexie.js](https://dexie.org/) — IndexedDB with real schema migrations
- [TanStack Router](https://tanstack.com/router) — type-safe routing with validated search params
- [Google OAuth verification](https://support.google.com/cloud/answer/13463073) — the process, and the Limited Use requirements for restricted scopes
