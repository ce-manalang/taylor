# Requirements: WWTS — What Would Taylor Say?

**Defined:** 2026-02-13
**Core Value:** When someone asks a question, the lyric they get back makes them feel understood.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Core Interaction

- [ ] **CORE-01**: User can type a life question into a text input
- [ ] **CORE-02**: User submits question and app matches it against curated lyrics via LLM
- [ ] **CORE-03**: User sees a single Taylor Swift lyric as the response
- [ ] **CORE-04**: User sees a loading indicator while the lyric is being matched
- [ ] **CORE-05**: User sees suggested starter questions to inspire their first ask

### Presentation

- [ ] **PRES-01**: UI is mobile-responsive and works well on phone screens
- [ ] **PRES-02**: User can copy the displayed lyric to clipboard with one tap
- [ ] **PRES-03**: Lyric appears with a reveal animation (fade-in or typewriter effect)
- [ ] **PRES-04**: UI feels soft, warm, and calm — matches "trusted friend after midnight" tone

### Security

- [x] **SECR-01**: OpenAI API key is hidden behind a serverless backend proxy
- [x] **SECR-02**: API requests are rate-limited to prevent abuse and cost spikes
- [x] **SECR-03**: User input is sanitized to prevent prompt injection

### Data

- [ ] **DATA-01**: Curated lyrics dataset seeded with initial Taylor Swift lyric collection
- [ ] **DATA-02**: LLM prompt includes few-shot examples for emotional tone calibration

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Core Interaction

- **CORE-06**: User can "ask again" to get a different lyric for the same question
- **CORE-07**: User can choose an emotional "era" to filter lyrics

### Presentation

- **PRES-05**: Dark mode color scheme
- **PRES-06**: Micro-interactions and subtle animations throughout UI
- **PRES-07**: Mobile-first design optimizations

### Data

- **DATA-03**: Confidence scoring — only show lyric if match quality is high enough
- **DATA-04**: Response caching for common questions

### Future Features

- **FUTR-01**: Daily advice card
- **FUTR-02**: Shareable quote images
- **FUTR-03**: Journaling mode
- **FUTR-04**: Save meaningful responses

## Out of Scope

| Feature | Reason |
|---------|--------|
| User accounts / authentication | Stateless, no login needed — each question is a fresh moment |
| Chat history | No persistence — intentional simplicity |
| Song-by-song citations | The lyric stands alone, no attribution shown |
| Monetization | Personal project |
| Complex UI | Intentional simplicity — "done is kinder than perfect" |
| Vector database | Overkill for <100 lyrics — embed in prompt instead |
| LangChain / orchestration frameworks | Unnecessary complexity for simple matching |
| Budget alerts / cost caps | Deferred until usage warrants monitoring |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| CORE-01 | Phase 3 | Pending |
| CORE-02 | Phase 2 | Pending |
| CORE-03 | Phase 3 | Pending |
| CORE-04 | Phase 3 | Pending |
| CORE-05 | Phase 3 | Pending |
| PRES-01 | Phase 3 | Pending |
| PRES-02 | Phase 3 | Pending |
| PRES-03 | Phase 3 | Pending |
| PRES-04 | Phase 3 | Pending |
| SECR-01 | Phase 1 | Complete |
| SECR-02 | Phase 1 | Complete |
| SECR-03 | Phase 1 | Complete |
| DATA-01 | Phase 2 | Pending |
| DATA-02 | Phase 2 | Pending |

**Coverage:**
- v1 requirements: 14 total
- Mapped to phases: 14
- Unmapped: 0

---
*Requirements defined: 2026-02-13*
*Last updated: 2026-02-14 after Phase 1 completion*
