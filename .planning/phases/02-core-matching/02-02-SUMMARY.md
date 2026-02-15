---
phase: 02-core-matching
plan: 02
subsystem: matching-engine
tags: [matching-pipeline, openai-embeddings, pgvector, llm-selection, few-shot-prompt, fallback-handling]

# Dependency graph
requires:
  - phase: 02-core-matching
    plan: 01
    provides: Supabase database with lyrics and match_lyrics function
  - phase: 01-backend-security
    provides: Rate limiting, sanitization, error handling infrastructure
provides:
  - Full matching pipeline: embedding -> pgvector search -> LLM selection -> fallback
  - Poetic fallback message pool for no-match scenarios
  - Few-shot prompted emotional matching system
  - Mock API with varied responses for frontend development
affects: [02-03-prompt-refinement, 03-user-interface]

# Tech tracking
tech-stack:
  added: [@supabase/supabase-js, text-embedding-3-small, gpt-4o-mini few-shot matching]
  patterns: [emotional calibration, temperature-based variation, poetic fallbacks, lazy singleton pattern]

key-files:
  created: []
  modified:
    - api/ask.ts
    - src/lib/mock-api.ts
    - package.json

key-decisions:
  - "Temperature 0.6 for emotional variation - repeated questions can return different lyrics (feels alive)"
  - "3 few-shot examples: self-doubt->empowerment, heartbreak->raw pain, NO_MATCH demonstration"
  - "System prompt tone: poetic & intuitive - 'feel the emotional weight, not just the words'"
  - "Match threshold 0.70 to start - conservative tuning, can adjust based on testing"
  - "Fallback messages are soft & poetic (not error-like) - authored by Claude"
  - "Response enforcement in prompt only (no post-hoc validation) - trust the calibration"

patterns-established:
  - "LLM final selection from top-N candidates enables emotional nuance beyond pure similarity"
  - "NO_MATCH handling with rotating fallback pool creates graceful degradation"
  - "Mock API simulates both paths (lyric responses + fallbacks) for complete frontend testing"

# Metrics
duration: 2min
completed: 2026-02-15
---

# Phase 02 Plan 02: Matching Engine API Summary

**Full matching pipeline with embedding generation, pgvector search, few-shot LLM selection, and poetic fallback handling**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-15T10:53:06Z
- **Completed:** 2026-02-15T10:55:06Z
- **Tasks:** 2 (both automated)
- **Files modified:** 3

## Accomplishments
- Installed @supabase/supabase-js client library
- Rewrote api/ask.ts with full matching pipeline preserving all Phase 1 security
- Implemented embedding generation using text-embedding-3-small (locked model)
- Integrated pgvector similarity search via match_lyrics RPC (threshold 0.70)
- Created LLM final selection with 3 few-shot emotional matching examples
- Authored 5 soft & poetic fallback messages for no-match scenarios
- Set temperature to 0.6 for response variation (same question can return different lyrics)
- Updated mock API with lyric pool and fallback message simulation
- Verified TypeScript compilation succeeds

## Task Commits

Each task was committed atomically:

1. **Task 1: Install Supabase client and rewrite api/ask.ts** - `c733410` (feat)
2. **Task 2: Update mock API with realistic matching responses** - `1bfedf6` (feat)

**Plan metadata:** Pending (will be created in final commit)

## Files Created/Modified

### Created
None - modified existing infrastructure

### Modified
- `api/ask.ts` - Full matching pipeline replacing generic OpenAI call
- `src/lib/mock-api.ts` - Lyric pool and fallback simulation
- `package.json` - Added @supabase/supabase-js dependency

## Decisions Made

**1. Temperature 0.6 for emotional variation**
- Rationale: Within 0.5-0.7 range specified by user, enables "feels alive" behavior
- Same question can return different lyrics across repeated calls
- Balances consistency with natural variation

**2. Few-shot examples: 3 patterns**
- Self-doubt -> empowerment: "I'm the only one of me, baby, that's the fun of me"
- Heartbreak -> raw pain: "You call me up again just to break me like a promise"
- NO_MATCH demonstration: Irrelevant question returns exactly "NO_MATCH"
- Teaches LLM emotional resonance over keyword matching

**3. System prompt tone: poetic & intuitive**
- "Feel the emotional weight of the question — not just the words, but the ache or hope behind them"
- Emphasizes emotional calibration over literal interpretation
- Enforces 1-2 line lyric-only response format

**4. Match threshold 0.70 (conservative starting point)**
- Per research recommendations, start conservative
- Can tune based on production testing
- Too low = irrelevant matches, too high = excessive fallbacks

**5. Fallback message pool (Claude-authored, soft & poetic)**
- "Some feelings are still waiting for their song."
- "Not every question has found its lyric yet."
- "Even Taylor doesn't have words for everything."
- "This one's still between the lines."
- "Sometimes silence says more than lyrics can."
- Rationale: Feels like app doesn't have words yet, not like an error

**6. No post-hoc validation**
- Trust prompt calibration and few-shot examples
- LLM can return lyric not in dataset if truly best match (dataset-preferred, not dataset-only)
- Simplifies response handling, reduces latency

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - straightforward implementation with clear design decisions from 02-CONTEXT.md and research.

## Next Phase Readiness

**Ready for 02-03 (Prompt Refinement):**
- Full pipeline in place for testing and iteration
- Few-shot examples provide baseline emotional calibration
- Fallback handling enables graceful degradation testing
- Mock API enables local iteration on prompt changes

**Potential future tuning:**
- Similarity threshold adjustment based on production data
- Few-shot example expansion if emotional range gaps emerge
- Fallback message pool expansion if users see repeats

## Self-Check: PASSED

All files and commits verified:
- FOUND: api/ask.ts (modified)
- FOUND: src/lib/mock-api.ts (modified)
- FOUND: package.json (modified)
- FOUND: c733410 (Task 1 commit)
- FOUND: 1bfedf6 (Task 2 commit)
- VERIFIED: npm run build succeeds (TypeScript compiles)

---
*Phase: 02-core-matching*
*Completed: 2026-02-15*
