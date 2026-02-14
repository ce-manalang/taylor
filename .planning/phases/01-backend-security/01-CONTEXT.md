# Phase 1: Backend & Security - Context

**Gathered:** 2026-02-14
**Status:** Ready for planning

<domain>
## Phase Boundary

Serverless proxy that sits between React frontend and OpenAI API. Protects API credentials, rate-limits requests, and sanitizes user input. No matching logic, no UI changes, no lyrics dataset — those are Phase 2 and 3.

</domain>

<decisions>
## Implementation Decisions

### Hosting platform
- Deploy on Vercel — user has an existing account
- Repo not yet connected to Vercel — connecting is part of this phase
- Use mock/stub locally during development, real Vercel function only on deployed environment
- Vercel serverless functions (not edge) for OpenAI proxy

### API proxy behavior
- Single endpoint accepts `{ question: string }` — frontend sends nothing else
- Returns `{ lyric: string }` — no metadata, no song info, just the lyric text
- 10-second timeout for OpenAI requests — show error if exceeded
- On OpenAI failure or timeout: return error message ("Something went wrong, try again") — no fallback lyric
- Honest error handling — don't hide failures behind random responses

### Rate limiting strategy
- Friendly message when rate-limited: "Take a breath. Come back in a bit." — warm, on-brand, not technical
- Hard daily cap of 50-100 requests per IP to prevent automated abuse
- Store rate limit state in Vercel KV — persistent across serverless invocations

### Claude's Discretion
- Exact hourly rate limit number (research suggested 5/hour — Claude can adjust based on what's practical)
- Vercel KV configuration details
- Exact structure of error response payloads

### Input sanitization
- Block and warn on suspected prompt injection — don't silently sanitize
- 200 character limit on questions — forces conciseness, reduces injection surface
- Allow any length of input including single words ("love", "why") — no minimum
- Blocked input message is vague and warm: "I couldn't understand that one. Try asking differently?" — doesn't reveal what triggered the block
- Don't reveal detection logic to the user

</decisions>

<specifics>
## Specific Ideas

- Error messages and rate limit messages should match the app's tone — warm, gentle, not technical
- "Take a breath. Come back in a bit." is the exact rate limit message the user wants
- Mock locally / deploy to Vercel — no local serverless runtime needed during development

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-backend-security*
*Context gathered: 2026-02-14*
