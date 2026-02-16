# WWTS — What Would Taylor Say?

## What This Is

A small, intentionally simple web app where you ask a life question and receive a single Taylor Swift lyric that speaks to your moment. No explanation, no context — just the right line at the right time. Designed to feel like a trusted friend writing back to you after midnight.

## Core Value

When someone asks a question, the lyric they get back makes them feel understood.

## Requirements

### Validated

- ✓ User can type a life question into a text input — v1.0
- ✓ App matches question against curated lyrics via LLM — v1.0
- ✓ User sees a single Taylor Swift lyric as the response — v1.0
- ✓ Loading indicator while lyric is being matched — v1.0
- ✓ Suggested starter questions to inspire first ask — v1.0
- ✓ Mobile-responsive UI with proper touch targets — v1.0
- ✓ Copy lyric to clipboard with one tap — v1.0
- ✓ Typewriter reveal animation — v1.0
- ✓ Soft, warm, calm aesthetic ("trusted friend after midnight") — v1.0
- ✓ OpenAI API key hidden behind serverless proxy — v1.0
- ✓ Rate limiting (5/hr, 75/day) — v1.0
- ✓ Input sanitization against prompt injection — v1.0
- ✓ Curated lyrics dataset with embeddings — v1.0
- ✓ Few-shot examples for emotional tone calibration — v1.0

### Active

(None — define with `/gsd:new-milestone`)

### Out of Scope

- Accounts or authentication — stateless, no login needed
- Chat history — each question is a fresh moment
- Song-by-song citations — the lyric stands alone
- Monetization — personal project
- LangChain / orchestration frameworks — unnecessary complexity

## Context

Shipped v1.0 with ~1,287 LOC (TypeScript/CSS).
Tech stack: React 19, Vite 7, TypeScript, Vercel Serverless, OpenAI (gpt-4o-mini + text-embedding-3-small), Supabase pgvector, Upstash Redis.
Production URL: https://taylor-opal.vercel.app
30 curated lyrics covering heartbreak, resilience, empowerment, love, growth.

## Constraints

- **Tech stack**: React 19 + Vite 7 + TypeScript + Vercel
- **API**: OpenAI gpt-4o-mini for matching, text-embedding-3-small for embeddings
- **Database**: Supabase pgvector for lyrics storage and similarity search
- **Simplicity**: Intentionally minimal — resist feature creep
- **Tone**: UI and UX must feel soft, kind, and quietly hopeful

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Curated lyrics dataset (not LLM memory) | Control over exactly which lyrics appear, quality over quantity | ✓ Good — 30 lyrics with clear emotional coverage |
| LLM picks the lyric (not tags/search) | Natural language understanding matches emotional nuance better than categories | ✓ Good — heartbreak/loneliness matches feel accurate |
| Just the lyric, no context | The line should speak for itself — explanations diminish the moment | ✓ Good — minimal presentation enhances impact |
| Start with small seed dataset | Ship something that works, grow the collection intentionally | ✓ Good — 30 lyrics sufficient for v1 |
| Vercel serverless for API proxy | Zero-config deployment, free tier sufficient | ✓ Good — simple and reliable |
| Supabase pgvector for embeddings | Managed Postgres with vector support, free tier | ✓ Good — similarity search works well |
| text-embedding-3-small | 5x cheaper than ada-002, better accuracy | ✓ Good — embeddings accurate for emotional matching |
| Temperature 0.6 for LLM selection | Repeated questions return different lyrics (feels alive) | ✓ Good — variation feels natural |
| Self-contained api/ask.ts | Vercel/Vite compilation boundary prevents shared imports | ⚠️ Revisit — 260 lines, works but could be cleaner |
| JS typewriter (not CSS) | Multi-line lyrics need character-by-character, not width animation | ✓ Good — handles all lyric lengths |

---
*Last updated: 2026-02-16 after v1.0 milestone*
