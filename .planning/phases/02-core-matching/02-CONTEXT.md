# Phase 2: Core Matching - Context

**Gathered:** 2026-02-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Working lyric matching engine that understands emotional context. Takes a user's life question, finds the best Taylor Swift lyric from a curated dataset using embeddings + LLM selection, and returns it. Covers: lyrics dataset, embedding-based matching, prompt engineering, and response guardrails.

</domain>

<decisions>
## Implementation Decisions

### Lyrics Dataset
- ~30 curated lyrics to start — tight collection, every lyric is a banger
- Just the lyric text, no mood tags or theme metadata — let the LLM feel the words
- Stored in Supabase (new project) — not a static file in the codebase
- Lyrics table with pgvector column for embeddings

### Matching Approach
- Embeddings + similarity search via Supabase pgvector
- User question → OpenAI embedding → pgvector similarity search → top 3 candidates
- LLM (gpt-4o-mini) picks the final lyric from the 3 candidates
- If none of the 3 fit, LLM can return "no match" — triggers a rotating fallback message
- Dataset preferred, not dataset-only: try curated lyrics first, but LLM can pull from its own Taylor Swift knowledge if nothing fits

### Prompt Engineering
- Tone: poetic & intuitive — "feel the question, not just the words"
- Few-shot examples: 2-3 question → lyric pairs (no reasoning chain)
- No-match fallback: rotating pool of soft & poetic messages, randomly selected
  - e.g. "Some feelings are still waiting for their song."
  - Claude authors the fallback pool (~5 messages)

### Response Guardrails
- Max lyric length: 1-2 lines — punchy, single-thought lyrics
- No post-hoc validation against dataset — trust the prompt
- Repeated identical questions can return different lyrics (temperature > 0) — feels alive
- Response must be the lyric only, nothing else (enforced in prompt, carried from Phase 1)

### Claude's Discretion
- Exact system prompt wording and few-shot example selection
- OpenAI embedding model choice (text-embedding-3-small vs ada-002)
- Supabase table schema details
- pgvector similarity threshold for "no match" detection
- Fallback message pool authoring
- Temperature value for gpt-4o-mini

</decisions>

<specifics>
## Specific Ideas

- Fallback messages should feel soft and poetic — like the app itself doesn't have the words yet, not like an error
- The matching should prioritize emotional vibe over literal keyword overlap
- With only ~30 lyrics, the full dataset easily fits in a prompt too — but embeddings are the primary path for future scalability
- The api/ask.ts serverless function is self-contained (Phase 1 lesson) — Supabase client will need to be inlined there too

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-core-matching*
*Context gathered: 2026-02-15*
