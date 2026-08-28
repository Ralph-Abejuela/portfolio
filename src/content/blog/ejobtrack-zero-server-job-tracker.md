---
title: "ejobtrack: A Zero-Server Job Tracker That Parses Your Gmail"
description: "ejobtrack is a zero-server job application tracker that syncs Gmail via OAuth 2.0, parses status updates from LinkedIn, Indeed, and 50+ ATS, and runs ML inference on-device with Transformers.js — no tokens or email data ever leave the browser."
pubDate: 2026-07-20
tags: ["React", "TypeScript", "Gmail API", "Transformers.js", "IndexedDB"]
---

**ejobtrack is a zero-server job application tracker.** It auto-syncs Gmail via OAuth 2.0 and parses application status from LinkedIn, Indeed, and 50+ applicant tracking systems using regex parsers, with an on-device Transformers.js ML fallback for unknown senders.

## Why zero-server?

Most job trackers store your data on their servers. ejobtrack takes the opposite approach:

- **Tokens, email data, and ML inference never leave the browser** — verifiable in DevTools.
- **Client-only architecture**: IndexedDB for storage, Cloudflare Pages for hosting.
- **No backend to maintain, scale, or pay for.**

## How parsing works

- Regex-based parser registry for 50+ known ATS platforms.
- **Fuzzy duplicate detection** across multi-platform applications — one job applied via LinkedIn and the company site is detected as the same application.
- Unknown senders fall back to an on-device Transformers.js model, so even unrecognized emails get classified without a server round-trip.

## Extensible by design

The parser registry is built for community contribution: anyone can add a new platform's email patterns without touching the core app.

**Stack:** React, TypeScript, Gmail API, Transformers.js, Dexie.js (IndexedDB), Cloudflare Pages.

Started July 2026 and actively maintained.
