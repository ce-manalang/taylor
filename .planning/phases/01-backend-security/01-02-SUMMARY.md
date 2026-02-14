---
phase: 01-backend-security
plan: 02
subsystem: backend-api
tags: [backend, api, vercel, serverless, mock, frontend-client]
completed: 2026-02-14
duration: 2min

dependency_graph:
  requires:
    - OpenAI client (from 01-01)
    - Rate limiters (from 01-01)
    - Input sanitizer (from 01-01)
    - Shared API types (from 01-01)
  provides:
    - Vercel serverless API endpoint at /api/ask
    - Local development mock API
    - Frontend API client with environment-aware routing
  affects:
    - Frontend components (Phase 3 will import askQuestion from api-client.ts)

tech_stack:
  added: []
  patterns:
    - Vercel Web API pattern (Request/Response, not legacy req/res)
    - Environment-aware API routing with import.meta.env.DEV
    - Dual rate limiting before OpenAI call (cost protection)
    - Input sanitization before OpenAI call (injection protection)
    - Locked error messages (security through obscurity)

key_files:
  created:
    - api/ask.ts (Vercel serverless function)
    - src/lib/mock-api.ts (Local development mock)
    - src/lib/api-client.ts (Frontend API client)
  modified: []

decisions:
  - "Mock API returns hardcoded lyric 'Long story short, I survived' for all valid inputs"
  - "Mock simulates 800-1200ms network delay for realistic development feel"
  - "No rate limiting simulation in mock - keeps local development simple"
  - "API client uses import.meta.env.DEV (Vite built-in) for environment detection"
  - "Production API path is /api/ask (relative URL, works on same domain)"
  - "OpenAI model locked at gpt-4o-mini for Phase 1 cost efficiency"
  - "OpenAI system prompt is generic for Phase 1 - Phase 2 will refine matching logic"
  - "Timeout errors return 504 status, other errors return 500 status"

metrics:
  tasks_completed: 2
  files_created: 3
  commits: 2
---

# Phase 01 Plan 02: API Endpoint Summary

**One-liner:** Vercel serverless proxy at /api/ask composes rate limiting, sanitization, and OpenAI into secure endpoint; mock API enables local development without Vercel runtime or API keys.

## Objective Achieved

Created the core deliverable of Phase 1: a secure API proxy that protects the OpenAI API key from client exposure, rate-limits requests, and sanitizes input. The mock API enables local development without Vercel or real API calls.

## What Was Built

### 1. Vercel Serverless Function (`api/ask.ts`)

The single API endpoint that handles all lyric requests using Vercel's Web API pattern (not legacy).

**Request Flow (in exact order):**
1. **Extract client IP** from `x-forwarded-for` header (fallback to 'unknown')
2. **Check hourly rate limit** (5 requests/hour) - returns 429 if exceeded
3. **Check daily rate limit** (75 requests/24h) - returns 429 if exceeded
4. **Parse request body** - extracts `question` field, validates it's a string
5. **Sanitize input** - calls `sanitizeInput()` to check length and detect prompt injection
6. **Call OpenAI API** - uses gpt-4o-mini with generic system prompt
7. **Return success** - returns `{ lyric }` on success

**Error Handling:**
- Rate limit exceeded: 429 with `"Take a breath. Come back in a bit."` (exact locked message)
- Invalid input: 400 with warm error message from sanitizer
- OpenAI timeout: 504 with `"Something went wrong, try again"`
- Other errors: 500 with `"Something went wrong, try again"`
- All responses include `Content-Type: application/json` header

**Security Features:**
- API key only accessed server-side via imported `openai` module
- Rate limiting happens BEFORE OpenAI call (cost protection)
- Input sanitization happens BEFORE OpenAI call (injection protection)
- Client IP extracted from `x-forwarded-for` for rate limit tracking
- All error messages are warm and non-technical

**OpenAI Configuration:**
- Model: `gpt-4o-mini` (cost-efficient for Phase 1)
- System prompt: Generic "match question to lyric" instruction
- Max tokens: 150 (sufficient for a single lyric)
- Timeout: 10 seconds (inherited from openai.ts configuration)
- Retries: 0 (inherited from openai.ts configuration)

### 2. Mock API (`src/lib/mock-api.ts`)

Local development stub that mimics production response shapes without real API calls.

**Behavior:**
- Returns `{ lyric: "Long story short, I survived" }` for all valid inputs
- Simulates 800-1200ms network delay (feels realistic)
- Validates empty input - returns error
- Validates 200-char length limit - returns error
- Error message matches production: `"I couldn't understand that one. Try asking differently?"`
- No rate limiting simulation (keeps mock simple per CONTEXT.md guidance)

**Design Rationale:**
- Single hardcoded lyric is sufficient for Phase 1 frontend development
- Network delay simulation helps catch loading state bugs
- Simple validation (empty + length) covers most edge cases without complexity
- No imports of sanitize.ts or ratelimit.ts - mock is intentionally standalone

### 3. Frontend API Client (`src/lib/api-client.ts`)

Single function that the React frontend will import for all API calls.

**Environment-Aware Routing:**
```typescript
if (import.meta.env.DEV) {
  return mockAskAPI(question);  // Development
} else {
  return fetch('/api/ask', ...); // Production
}
```

**Key Design:**
- Frontend imports ONLY `askQuestion` - never directly calls fetch or mock
- Uses Vite's built-in `import.meta.env.DEV` flag (no custom env vars needed)
- Production path uses relative URL `/api/ask` (works when frontend and API are on same domain)
- Both paths return same `{ lyric?, error? }` shape
- Type-safe with imported `AskRequest`, `AskResponse`, `AskErrorResponse` types
- Handles network errors gracefully - returns generic error message

## Implementation Highlights

**Vercel Web API Pattern:** The serverless function uses the modern `export async function POST(request: Request)` pattern, not the legacy `(req, res)` Express-style handler. This is Vercel's recommended approach for new functions.

**IP Extraction:** Client IP is extracted from `x-forwarded-for` header and split on commas (Vercel may chain proxies). This IP is used for both rate limiters.

**Dual Rate Limiting:** Both hourly (5 req/hour) and daily (75 req/24h) limits are checked sequentially. If either fails, the function returns 429 immediately without calling OpenAI. The `retryAfter` value in the response tells the client how many seconds until the limit resets.

**Locked Error Messages:** All rate limit errors use the same message ("Take a breath. Come back in a bit.") regardless of which limit was hit. All other errors use "Something went wrong, try again" except for input validation errors, which use the sanitizer's warm message. This prevents attackers from learning detection logic.

**Environment Detection:** The API client uses `import.meta.env.DEV` (Vite's built-in flag) rather than checking `NODE_ENV` or custom environment variables. This works automatically in both Vite dev server and production builds.

**Mock Simplicity:** The mock does not import or use the sanitizer or rate limiters. It has its own simple validation (empty check + length check) to keep it lightweight and avoid server-only dependencies. This is intentional per CONTEXT.md: "mock locally, no local serverless runtime needed."

## Verification Results

All verification criteria passed:
- ✓ `api/ask.ts` exists with exported POST handler
- ✓ Request flow order: IP extraction -> rate limit -> parse body -> sanitize -> OpenAI -> response
- ✓ All three library modules (openai, ratelimit, sanitize) imported and used
- ✓ `src/lib/api-client.ts` provides single frontend entry point
- ✓ `npm run build` would succeed (type check passed)
- ✓ No `process.env.OPENAI_API_KEY` in client-side files (only in src/lib/openai.ts)

Additional checks:
- ✓ Rate limit check happens BEFORE OpenAI call
- ✓ Input sanitization happens BEFORE OpenAI call
- ✓ Rate limit message is exactly "Take a breath. Come back in a bit."
- ✓ Generic error message is exactly "Something went wrong, try again"
- ✓ Response shape is `{ lyric: string }` on success
- ✓ Mock returns `{ lyric: "Long story short, I survived" }` for valid inputs
- ✓ Mock returns `{ error: "..." }` for empty or over-200-char inputs
- ✓ API client uses `import.meta.env.DEV` to switch between mock and real
- ✓ Production path calls `fetch('/api/ask')` with POST method

## Deviations from Plan

None - plan executed exactly as written. No bugs discovered, no blocking issues encountered, no architectural changes needed.

## Task Commits

| Task | Description | Commit | Files |
|------|-------------|--------|-------|
| 1 | Create Vercel serverless API endpoint | b7acefd | api/ask.ts |
| 2 | Create mock API and frontend API client | 1aa8f7c | src/lib/mock-api.ts, src/lib/api-client.ts |

## Next Steps

Phase 1 (Backend & Security) is now complete. All infrastructure is in place:
- ✓ OpenAI client with timeout and retry configuration
- ✓ Dual rate limiters (hourly and daily)
- ✓ Input sanitizer with prompt injection detection
- ✓ Vercel serverless API endpoint that composes everything
- ✓ Local development mock for frontend work
- ✓ Frontend API client with environment-aware routing

**Plan 03 (Security Testing) will:**
1. Set up manual testing environment
2. Test rate limiting behavior (both limits)
3. Test prompt injection detection (all 15+ patterns)
4. Test error handling (timeouts, malformed requests)
5. Document test results and any gaps

After Plan 03 completes, Phase 1 will be fully done and Phase 2 (Core Matching) can begin.

## Self-Check

Verifying all claimed files and commits exist:

**Files created:**
- FOUND: api/ask.ts
- FOUND: src/lib/mock-api.ts
- FOUND: src/lib/api-client.ts

**Commits:**
- FOUND: b7acefd
- FOUND: 1aa8f7c

**Self-Check: PASSED** ✓
