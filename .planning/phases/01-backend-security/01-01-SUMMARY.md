---
phase: 01-backend-security
plan: 01
subsystem: backend-infrastructure
tags: [backend, security, dependencies, rate-limiting, input-validation]
completed: 2026-02-14
duration: 2min

dependency_graph:
  requires: []
  provides:
    - OpenAI client configured with 10-second timeout and zero retries
    - Dual rate limiters (5/hour, 75/day) using Upstash Redis
    - Input sanitizer with prompt injection detection
    - Shared API types for request/response contracts
  affects:
    - api/ask.ts (will import these modules in Plan 02)

tech_stack:
  added:
    - openai@6.22.0
    - "@upstash/ratelimit@2.0.8"
    - "@upstash/redis@1.36.2"
  patterns:
    - Sliding window rate limiting with dual limits (hourly + daily)
    - Regex-based prompt injection detection with Unicode normalization
    - Environment variable validation at module initialization

key_files:
  created:
    - src/lib/openai.ts (OpenAI client)
    - src/lib/ratelimit.ts (Rate limiters)
    - src/lib/sanitize.ts (Input validation)
    - src/types/api.ts (API types)
    - .env.example (Environment template)
    - vercel.json (Function configuration)
  modified:
    - package.json (added dependencies)
    - package-lock.json (lockfile update)

decisions:
  - "OpenAI timeout locked at 10 seconds for predictable serverless behavior"
  - "Zero retries on OpenAI client to avoid unpredictable latency"
  - "Hourly rate limit: 5 requests (1 question + 4 retries/variations)"
  - "Daily rate limit: 75 requests (midpoint of 50-100 range)"
  - "Identical error message for all rejection types to avoid revealing detection logic"
  - "Vercel function max duration: 15 seconds (allows overhead beyond 10s OpenAI timeout)"

metrics:
  tasks_completed: 3
  files_created: 8
  commits: 3
---

# Phase 01 Plan 01: Backend Infrastructure Summary

**One-liner:** JWT auth with refresh rotation using jose library... wait, wrong summary. OpenAI client with 10-second timeout, dual rate limiters (5/hour, 75/day), and prompt injection detection via regex patterns.

## Objective Achieved

Established the foundational backend modules that the API endpoint will compose into a working serverless function. Each module is independently testable, has a single responsibility, and validates its environment variables at initialization.

## What Was Built

### 1. Shared API Types (`src/types/api.ts`)
- `AskRequest`: Request shape with `question` field
- `AskResponse`: Response shape with `lyric` field
- `AskErrorResponse`: Error shape with `error` message and optional `retryAfter` seconds

### 2. OpenAI Client (`src/lib/openai.ts`)
- Configured with `OPENAI_API_KEY` from environment
- 10-second timeout (locked decision from CONTEXT.md)
- Zero retries for predictable serverless behavior
- Throws descriptive error if API key missing

### 3. Rate Limiters (`src/lib/ratelimit.ts`)
- **Hourly:** 5 requests per hour using sliding window
  - Rationale: Allows 1 question + 4 retries/variations per hour
  - Prefix: `wwts:hourly`
- **Daily:** 75 requests per 24 hours using sliding window
  - Rationale: Midpoint of 50-100 range—generous for real users, tight enough to block automation
  - Prefix: `wwts:daily`
- Both use Upstash Redis for persistent state across serverless invocations
- Validates `REDIS_URL` and `REDIS_TOKEN` at initialization

### 4. Input Sanitizer (`src/lib/sanitize.ts`)
- Enforces 200-character maximum input length
- No minimum length—single words like "love" and "why" are valid
- Detects 15+ prompt injection patterns:
  - "ignore previous/prior instructions"
  - "disregard system prompt"
  - "you are now in developer mode"
  - "bypass safety checks"
  - "reveal your system prompt"
  - "act as system/admin"
  - "new instructions:" prefix attacks
  - Common obfuscation variants (ign0re, bypas+)
- Unicode normalization (NFKC) prevents obfuscation via Unicode variants
- Returns identical error message for all rejection types: "I couldn't understand that one. Try asking differently?"

### 5. Infrastructure Configuration
- `.env.example`: Template with `OPENAI_API_KEY`, `REDIS_URL`, `REDIS_TOKEN`
- `vercel.json`: Function config with 15-second max duration and 1GB memory
- `.gitignore`: Already covers `.env.local` via `*.local` pattern

## Implementation Highlights

**Environment Variable Validation:** All three library modules validate their required environment variables at initialization and throw descriptive errors if any are missing. This provides fast failure and clear error messages during deployment.

**Sliding Window Algorithm:** Both rate limiters use `Ratelimit.slidingWindow()` instead of fixed windows. This prevents burst abuse at window boundaries (e.g., user can't make 5 requests at 11:59 and 5 more at 12:01).

**Unicode Normalization:** The sanitizer uses `normalize('NFKC')` to prevent obfuscation attacks via Unicode lookalikes (e.g., using Cyrillic 'о' instead of Latin 'o' in "ignore").

**Generic Error Messages:** All validation failures return the same message. This prevents attackers from learning what triggered the block (e.g., if length errors had different messages than injection detection, attackers could map the detection boundaries).

## Verification Results

All verification criteria passed:
- ✓ All three packages installed: `openai`, `@upstash/ratelimit`, `@upstash/redis`
- ✓ Type check passes: `npx tsc --noEmit` with no errors
- ✓ All exports present: `openai`, `rateLimiter`, `dailyRateLimiter`, `sanitizeInput`, API types
- ✓ No secrets in committed code—only `.env.example` with placeholder values
- ✓ `.env.local` is gitignored via `*.local` pattern

## Deviations from Plan

**1. [Rule 1 - Bug] Fixed prompt injection pattern for "reveal your system prompt"**
- **Found during:** Task 3 verification
- **Issue:** The regex pattern `/reveal\s+(hidden|system|internal)\s+(prompt|data|instructions?)/i` didn't match "reveal your system prompt" because "your" comes between "reveal" and "system"
- **Fix:** Updated pattern to `/reveal\s+(hidden|system|internal|your|the)\s+(system\s+)?(prompt|data|instructions?)/i` to handle "reveal your..." variants
- **Files modified:** `src/lib/sanitize.ts`
- **Commit:** Included in Task 3 commit (4b4991d)

## Task Commits

| Task | Description | Commit | Files |
|------|-------------|--------|-------|
| 1 | Install dependencies and create project infrastructure | 09da074 | package.json, package-lock.json, src/types/api.ts, .env.example, vercel.json |
| 2 | Create OpenAI client and rate limiter modules | 2e99091 | src/lib/openai.ts, src/lib/ratelimit.ts |
| 3 | Create input sanitizer with prompt injection detection | 4b4991d | src/lib/sanitize.ts |

## Next Steps

Plan 02 will compose these modules into the `/api/ask` serverless function that:
1. Accepts POST requests with `AskRequest` body
2. Validates input using `sanitizeInput`
3. Checks rate limits using both `rateLimiter` and `dailyRateLimiter`
4. Calls OpenAI using the `openai` client
5. Returns `AskResponse` or `AskErrorResponse`

All the building blocks are now in place. Plan 02 is pure composition.

## Self-Check

Verifying all claimed files and commits exist:

**Files created:**
- FOUND: src/lib/openai.ts
- FOUND: src/lib/ratelimit.ts
- FOUND: src/lib/sanitize.ts
- FOUND: src/types/api.ts
- FOUND: .env.example
- FOUND: vercel.json

**Commits:**
- FOUND: 09da074
- FOUND: 2e99091
- FOUND: 4b4991d

**Self-Check: PASSED** ✓
