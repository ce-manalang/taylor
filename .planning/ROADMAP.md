# Roadmap: WWTS — What Would Taylor Say?

## Overview

This roadmap delivers a working lyric-matching advice app in three phases. Phase 1 establishes secure backend infrastructure to protect API keys and prevent cost spikes. Phase 2 implements the core matching engine with curated lyrics and semantic understanding. Phase 3 builds the user interface with mobile responsiveness, dark mode, and thoughtful presentation. Each phase delivers a complete, testable capability that builds toward the core value: when someone asks a question, the lyric they get back makes them feel understood.

## Phases

- [x] **Phase 1: Backend & Security** - Secure serverless foundation for API calls
- [ ] **Phase 2: Core Matching** - Semantic lyric matching engine with curated dataset
- [ ] **Phase 3: User Interface** - Complete interaction flow with polished presentation

## Phase Details

### Phase 1: Backend & Security
**Goal**: API infrastructure that protects credentials and prevents runaway costs
**Depends on**: Nothing (first phase)
**Requirements**: SECR-01, SECR-02, SECR-03
**Success Criteria** (what must be TRUE):
  1. OpenAI API key is never exposed in client-side code or browser network tabs
  2. API requests are rate-limited to prevent abuse (5 requests/hour per user, 100/day per IP)
  3. User input is sanitized before being sent to LLM to prevent prompt injection
  4. Backend proxy successfully forwards requests to OpenAI and returns responses
**Plans**: 3 plans

Plans:
- [x] 01-01-PLAN.md — Project infrastructure and library modules (deps, types, OpenAI client, rate limiter, sanitizer)
- [x] 01-02-PLAN.md — API endpoint and local development mock (serverless function, mock API, frontend client)
- [x] 01-03-PLAN.md — Vercel deployment and end-to-end verification (deploy, configure env vars, verify)

### Phase 2: Core Matching
**Goal**: Working lyric matching engine that understands emotional context
**Depends on**: Phase 1 (requires secure API infrastructure)
**Requirements**: DATA-01, DATA-02, CORE-02
**Success Criteria** (what must be TRUE):
  1. Curated dataset contains 50-100 Taylor Swift lyrics with emotional tone metadata
  2. User's question is matched against lyrics using semantic similarity (embeddings)
  3. System returns a single lyric (2-3 lines max) that fits the emotional tone of the question
  4. LLM prompt includes few-shot examples that calibrate emotional matching accuracy
  5. Response validation enforces length limits and prevents full song reproduction
**Plans**: 3 plans

Plans:
- [ ] 02-01-PLAN.md -- Supabase schema, lyrics curation, seed script with embeddings
- [ ] 02-02-PLAN.md -- Core matching pipeline in api/ask.ts (embedding, pgvector, LLM selection, fallbacks)
- [ ] 02-03-PLAN.md -- Vercel deployment and end-to-end matching verification

### Phase 3: User Interface
**Goal**: Complete end-to-end user experience from question to lyric
**Depends on**: Phase 2 (requires working matching engine)
**Requirements**: CORE-01, CORE-03, CORE-04, CORE-05, PRES-01, PRES-02, PRES-03, PRES-04
**Success Criteria** (what must be TRUE):
  1. User can type a life question into a text input and submit it
  2. User sees a loading indicator while the lyric is being matched (3-8 second API call)
  3. User sees a single Taylor Swift lyric displayed with reveal animation (fade-in or typewriter)
  4. User can copy the displayed lyric to clipboard with one tap
  5. User sees suggested starter questions if they need inspiration
  6. UI is mobile-responsive and works well on phone screens with proper touch targets
  7. UI feels soft, warm, and calm — color scheme and typography match "trusted friend after midnight" tone
**Plans**: TBD

Plans:
- [ ] 03-01: TBD

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Backend & Security | 3/3 | ✓ Complete | 2026-02-14 |
| 2. Core Matching | 0/TBD | Not started | - |
| 3. User Interface | 0/TBD | Not started | - |
