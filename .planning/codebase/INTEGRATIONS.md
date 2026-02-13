# External Integrations

**Analysis Date:** 2026-02-13

## APIs & External Services

**OpenAI (Planned):**
- OpenAI Agent/API - Planned connection for providing emotional life advice responses
  - Status: Not yet integrated (documented in README.md as "planned connection after UI MVP")
  - SDK/Client: Not yet installed
  - Auth: Not yet implemented (will require API key via environment variable)
  - Purpose: Empathetic response generation for user questions

## Data Storage

**Databases:**
- Not applicable - MVP design explicitly excludes persistent storage
- No chat history, user accounts, or session persistence planned

**File Storage:**
- Local filesystem only
- Static assets in `public/` directory served by Vite

**Caching:**
- Not implemented - Not needed for MVP scope

## Authentication & Identity

**Auth Provider:**
- None - MVP explicitly excludes user accounts and authentication
- All interactions are anonymous, stateless

## Monitoring & Observability

**Error Tracking:**
- Not implemented - Not included in MVP scope

**Logs:**
- Browser console logging only
- No backend or server-side logging infrastructure

## CI/CD & Deployment

**Hosting:**
- Static hosting (SPA delivered to CDN or static host)
- Output: `dist/` directory from `npm run build`
- No backend server required

**CI Pipeline:**
- Not configured - Repository contains no CI configuration files

## Environment Configuration

**Required env vars:**
- None required for current MVP implementation
- OpenAI API key will be required when integration is implemented (planned)

**Secrets location:**
- Not applicable for current MVP
- When OpenAI integration is added, API keys should be managed via `.env.local` (not committed)

## Webhooks & Callbacks

**Incoming:**
- None - No backend or webhook infrastructure

**Outgoing:**
- None - No external integrations sending data back to external systems

## Future Integration Points

**Planned (documented in README.md):**
- OpenAI API for agent responses (core feature needed for MVP completion)
- No database or persistence planned for post-MVP before MVP validation

---

*Integration audit: 2026-02-13*
