# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-13)

**Core value:** When someone asks a question, the lyric they get back makes them feel understood.
**Current focus:** Phase 2 - Core Matching (in progress)

## Current Position

Phase: 2 of 3 (Core Matching)
Plan: 2 of 3 (complete)
Status: Phase 2 in progress
Last activity: 2026-02-15 — Completed plan 02-02 (Matching Engine API)

Progress: [██████░░░░] 67% (Phase 2 plans)

## Performance Metrics

**Velocity:**
- Total plans completed: 5
- Average duration: ~9 min
- Total execution time: ~0.85 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-backend-security | 3/3 | ~30min | ~10min |
| 02-core-matching | 2/3 | ~17min | ~8.5min |

**Recent Trend:**
- Last 5 plans: 01-02 (2min), 01-03 (~30min incl. debugging), 02-01 (15min), 02-02 (2min)
- Trend: 02-02 was fast (straightforward implementation with clear design)

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

**From Plan 02-02:**
- Temperature 0.6 for emotional variation - repeated questions can return different lyrics (feels alive)
- 3 few-shot examples: self-doubt->empowerment, heartbreak->raw pain, NO_MATCH demonstration
- System prompt tone: poetic & intuitive - "feel the emotional weight, not just the words"
- Match threshold 0.70 to start - conservative tuning, can adjust based on testing
- Fallback messages are soft & poetic (not error-like) - Claude-authored
- Response enforcement in prompt only (no post-hoc validation) - trust the calibration

**From Plan 02-01:**
- Use text-embedding-3-small (not ada-002) - 5x cheaper, better accuracy, locked model choice
- Use inner product (<#>) for similarity search - optimal for normalized OpenAI embeddings
- No vector indexes on 30-row dataset - sequential scan faster than index overhead
- Curated 30 lyrics covering diverse emotional range: resilience, heartbreak, empowerment, love, growth
- 1-2 line lyrics maximum - punchy single-thought format
- SQL generation pattern (seed script outputs SQL rather than direct DB connection)

**From Plan 01-03:**
- API function made self-contained (inlined in api/ask.ts) due to Vercel/Vite compilation boundary
- Redis env vars use REDIS_KV_REST_API_URL/TOKEN naming from Vercel Marketplace
- Production URL: https://taylor-opal.vercel.app
- Debug endpoint created and removed during verification

**From Plan 01-02:**
- Mock API now returns varied lyrics from pool (updated in 02-02) - simulates temperature > 0
- Mock simulates fallback messages for short questions (updated in 02-02)
- Mock simulates 800-1200ms network delay for realistic development feel
- No rate limiting simulation in mock - keeps local development simple
- API client uses import.meta.env.DEV (Vite built-in) for environment detection
- Production API path is /api/ask (relative URL, works on same domain)
- OpenAI model locked at gpt-4o-mini for matching selection

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

Last session: 2026-02-15 (Phase 2 plan 02-02 execution)
Stopped at: Completed 02-02-PLAN.md (Matching Engine API)
Resume file: None
Next action: Continue Phase 2 with plan 02-03 (Prompt Refinement)
