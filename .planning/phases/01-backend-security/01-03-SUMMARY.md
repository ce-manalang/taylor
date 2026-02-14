# Plan 01-03: Vercel Deployment & Verification — Summary

**Status:** Complete
**Duration:** ~30 min (including debugging env var configuration)
**Commits:** 7e627dd, 9cce39b, b898c4f, 8a9aae4, 402dbbc, e5984c9, 16cc3ac

## What Was Delivered

Deployed the WWTS backend to Vercel with working API endpoint, rate limiting, and input sanitization.

**Production URL:** https://taylor-opal.vercel.app

## Verification Results

| Test | Expected | Actual | Status |
|------|----------|--------|--------|
| Valid question | 200 + lyric | 200 + `"Cause you were ready for the world..."` | ✓ |
| Prompt injection | 400 + warm error | 400 + `"I couldn't understand that one..."` | ✓ |
| Over 200 chars | 400 + warm error | 400 + `"I couldn't understand that one..."` | ✓ |
| Single word "love" | 200 + lyric | 200 + `"All the rumors are true, yeah."` | ✓ |
| GET method | 405 | 405 + `"Method not allowed"` | ✓ |

## Deviations

1. **API function made self-contained** — Vercel serverless functions can't resolve TypeScript imports from `src/lib/` due to separate compilation context with Vite. Inlined all server logic (sanitization, OpenAI, rate limiting) directly in `api/ask.ts` with lazy initialization.

2. **Redis env var naming** — Vercel Marketplace Upstash integration injects `REDIS_KV_REST_API_URL` and `REDIS_KV_REST_API_TOKEN`, not `REDIS_URL`/`REDIS_TOKEN`. Added fallback support for multiple naming conventions.

3. **OpenAI billing** — Initial 500 errors caused by exceeded OpenAI quota. User resolved by checking billing.

## Key Files

- `api/ask.ts` — Self-contained serverless function (production)
- `src/lib/mock-api.ts` — Local development mock (unchanged)
- `src/lib/api-client.ts` — Frontend client that switches mock/real (unchanged)

## Self-Check

- [x] api/ask.ts deployed and responding
- [x] All verification tests pass
- [x] Debug endpoint removed
- [x] No secrets in committed code
