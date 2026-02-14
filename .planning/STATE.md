# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-13)

**Core value:** When someone asks a question, the lyric they get back makes them feel understood.
**Current focus:** Phase 1 - Backend & Security

## Current Position

Phase: 1 of 3 (Backend & Security)
Plan: 3 of 3 (executing 01-03-PLAN.md next)
Status: In progress
Last activity: 2026-02-14 — Completed plan 01-02

Progress: [██████░░░░] 67%

## Performance Metrics

**Velocity:**
- Total plans completed: 2
- Average duration: 2 min
- Total execution time: 0.07 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-backend-security | 2/3 | 4min | 2min |

**Recent Trend:**
- Last 5 plans: 01-01 (2min), 01-02 (2min)
- Trend: Consistent 2min/plan

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

**From Plan 01-02:**
- Mock API returns hardcoded lyric 'Long story short, I survived' for all valid inputs
- Mock simulates 800-1200ms network delay for realistic development feel
- No rate limiting simulation in mock - keeps local development simple
- API client uses import.meta.env.DEV (Vite built-in) for environment detection
- Production API path is /api/ask (relative URL, works on same domain)
- OpenAI model locked at gpt-4o-mini for Phase 1 cost efficiency
- OpenAI system prompt is generic for Phase 1 - Phase 2 will refine matching logic
- Timeout errors return 504 status, other errors return 500 status

**From Plan 01-01:**
- OpenAI timeout locked at 10 seconds for predictable serverless behavior
- Zero retries on OpenAI client to avoid unpredictable latency
- Hourly rate limit: 5 requests (1 question + 4 retries/variations)
- Daily rate limit: 75 requests (midpoint of 50-100 range)
- Identical error message for all rejection types to avoid revealing detection logic
- Vercel function max duration: 15 seconds (allows overhead beyond 10s OpenAI timeout)

**Earlier decisions:**
- Curated lyrics dataset (not LLM memory) — Control over exactly which lyrics appear, quality over quantity
- LLM picks the lyric (not tags/search) — Natural language understanding matches emotional nuance better than categories
- Just the lyric, no context — The line should speak for itself, explanations diminish the moment
- Start with small seed dataset — Ship something that works, grow the collection intentionally

### Pending Todos

None yet.

### Blockers/Concerns

**Phase 1 (Backend & Security):**
- ~~Must choose serverless platform~~ — RESOLVED: Using Vercel (vercel.json created in 01-01)

**Phase 2 (Core Matching):**
- Few-shot prompt engineering requires domain expertise in Taylor Swift catalog
- Research flagged this phase as likely needing `/gsd:research-phase` for emotional calibration

**Phase 3 (User Interface):**
- Dark mode and accessibility are table stakes (2026 user expectations) — must be included in v1, not deferred

## Session Continuity

Last session: 2026-02-14 (plan execution)
Stopped at: Completed 01-02-PLAN.md (API endpoint)
Resume file: None
Next action: Execute 01-03-PLAN.md (security testing)
