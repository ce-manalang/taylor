# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-13)

**Core value:** When someone asks a question, the lyric they get back makes them feel understood.
**Current focus:** Phase 1 - Backend & Security (complete, pending verification)

## Current Position

Phase: 1 of 3 (Backend & Security)
Plan: 3 of 3 (complete)
Status: All plans executed, awaiting phase verification
Last activity: 2026-02-14 — Completed plan 01-03 (Vercel deployment verified)

Progress: [██████████] 100% (Phase 1 plans)

## Performance Metrics

**Velocity:**
- Total plans completed: 3
- Average duration: ~10 min
- Total execution time: ~0.5 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-backend-security | 3/3 | ~30min | ~10min |

**Recent Trend:**
- Last 5 plans: 01-01 (2min), 01-02 (2min), 01-03 (~30min incl. debugging)
- Trend: 01-03 took longer due to Vercel env var debugging

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

**From Plan 01-03:**
- API function made self-contained (inlined in api/ask.ts) due to Vercel/Vite compilation boundary
- Redis env vars use REDIS_KV_REST_API_URL/TOKEN naming from Vercel Marketplace
- Production URL: https://taylor-opal.vercel.app
- Debug endpoint created and removed during verification

**From Plan 01-02:**
- Mock API returns hardcoded lyric 'Long story short, I survived' for all valid inputs
- Mock simulates 800-1200ms network delay for realistic development feel
- No rate limiting simulation in mock - keeps local development simple
- API client uses import.meta.env.DEV (Vite built-in) for environment detection
- Production API path is /api/ask (relative URL, works on same domain)
- OpenAI model locked at gpt-4o-mini for Phase 1 cost efficiency
- OpenAI system prompt is generic for Phase 1 - Phase 2 will refine matching logic

**From Plan 01-01:**
- OpenAI timeout locked at 10 seconds for predictable serverless behavior
- Zero retries on OpenAI client to avoid unpredictable latency
- Hourly rate limit: 5 requests (1 question + 4 retries/variations)
- Daily rate limit: 75 requests (midpoint of 50-100 range)
- Identical error message for all rejection types to avoid revealing detection logic

**Earlier decisions:**
- Curated lyrics dataset (not LLM memory)
- LLM picks the lyric (not tags/search)
- Just the lyric, no context
- Start with small seed dataset

### Pending Todos

- Rotate Redis token (credentials were exposed during debugging)

### Blockers/Concerns

**Phase 1 (Backend & Security):**
- ~~Must choose serverless platform~~ — RESOLVED: Using Vercel
- ~~Env var naming~~ — RESOLVED: REDIS_KV_REST_API_URL/TOKEN

**Phase 2 (Core Matching):**
- Few-shot prompt engineering requires domain expertise in Taylor Swift catalog
- Research flagged this phase as likely needing `/gsd:research-phase` for emotional calibration

**Phase 3 (User Interface):**
- Dark mode and accessibility are table stakes (2026 user expectations)

## Session Continuity

Last session: 2026-02-14 (plan execution + deployment verification)
Stopped at: All Phase 1 plans complete, verified on production
Resume file: None
Next action: Phase verification, then Phase 2 planning
