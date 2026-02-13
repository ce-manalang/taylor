# WWTS — What Would Taylor Say?

## What This Is

A small, intentionally simple web app where you ask a life question and receive a single Taylor Swift lyric that speaks to your moment. No explanation, no context — just the right line at the right time. Designed to feel like a trusted friend writing back to you after midnight.

## Core Value

When someone asks a question, the lyric they get back makes them feel understood.

## Requirements

### Validated

- ✓ React + Vite + TypeScript project scaffolded — existing
- ✓ Title screen renders — existing

### Active

- [ ] User can type a life question and submit it
- [ ] App sends question + curated lyrics to an LLM to pick the best match
- [ ] User sees a single Taylor Swift lyric as the response
- [ ] Response presentation feels intentional — the moment of receiving the lyric lands
- [ ] Curated lyrics dataset seeded with initial collection, designed to grow over time
- [ ] UI feels soft, warm, and calm — matches the emotional tone of the project

### Out of Scope

- Accounts or authentication — stateless, no login needed
- Chat history — each question is a fresh moment
- Song-by-song citations — the lyric stands alone
- Monetization — this is a personal project
- Complex UI — intentional simplicity
- Choosing an "era" — post-MVP
- Daily advice card — post-MVP
- Shareable quote images — post-MVP
- Journaling mode — post-MVP
- Mobile-first design — post-MVP
- Saving responses — post-MVP

## Context

- Existing codebase is a React 19 + Vite 7 + TypeScript project with a title screen and no backend
- The app connects to OpenAI's API to match questions against a curated lyrics dataset
- The lyrics dataset starts small (a handful of carefully chosen lines) and grows over time
- The README philosophy: "ship feelings before features" — the emotional quality of the experience matters more than feature count
- No copyrighted lyrics will be stored in the public repo — the dataset is a local/private concern

## Constraints

- **Tech stack**: React + Vite + TypeScript (already scaffolded) — existing investment
- **API**: OpenAI for lyric matching — already planned in README
- **Simplicity**: Intentionally minimal — resist feature creep
- **Tone**: UI and UX must feel soft, kind, and quietly hopeful

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Curated lyrics dataset (not LLM memory) | Control over exactly which lyrics appear, quality over quantity | — Pending |
| LLM picks the lyric (not tags/search) | Natural language understanding matches emotional nuance better than categories | — Pending |
| Just the lyric, no context | The line should speak for itself — explanations diminish the moment | — Pending |
| Start with small seed dataset | Ship something that works, grow the collection intentionally | — Pending |

---
*Last updated: 2026-02-13 after initialization*
