# Codebase Concerns

**Analysis Date:** 2026-02-13

## Tech Debt

**Unused CSS Stylesheet:**
- Issue: `src/App.css` contains template styling (.logo, .logo-spin, .card, .read-the-docs) that is not used by the minimal App component, creating orphaned code and maintenance burden
- Files: `src/App.css`
- Impact: Dead code adds cognitive load during future component development; increases CSS bundle size unnecessarily
- Fix approach: Remove all unused CSS selectors from `src/App.css`. Keep only styles needed by current components (heading, layout). Delete orphaned animations and logo-related rules.

**Unused HTML/CSS Framework Boilerplate:**
- Issue: `src/index.css` contains extensive Vite template styling (button styles, media queries, color schemes) that contradicts the project's stated "minimal CSS (intentional simplicity)" philosophy
- Files: `src/index.css`
- Impact: Over-engineered baseline styles conflict with minimalist design intent; adds unnecessary styling rules that may conflict with intentional design changes
- Fix approach: Audit `src/index.css` against actual component needs in `src/App.tsx`. Remove button styling (not used), logo animations, and unused theme rules. Keep only essential layout and typography.

**Inline Styles vs. Separate CSS:**
- Issue: `src/App.tsx` uses inline styles (display: flex, alignItems, justifyContent, fontFamily) alongside unused external CSS files, creating style location inconsistency
- Files: `src/App.tsx`, `src/App.css`
- Impact: Mixed styling approaches (inline vs. CSS files) makes it hard to track where styles live; increases refactoring friction when components grow
- Fix approach: Consolidate to one approach. Either move inline styles to `src/App.css` with clear organization, or embrace CSS-in-JS if React app scales. Document chosen pattern.

## Missing Critical Features

**No OpenAI Integration:**
- Problem: README documents that the app "connects a simple React interface to an OpenAI agent" and mentions "OpenAI Agent / API (planned connection after UI MVP)", but zero code exists for API integration, prompts, or backend connectivity
- Blocks: Core functionality - users cannot ask questions or receive advice. The title screen is complete, but actual product is not buildable
- Scope: This is an MVP-stage project explicitly acknowledging this gap, but indicates the backend work has not started
- Risk level: High - entire product value depends on this integration

**No Input Form:**
- Problem: App displays only heading with no user input mechanism
- Blocks: Users cannot ask questions; no question→answer flow implemented
- Scope: MVP-essential feature completely missing from frontend
- Risk level: High - core user interaction path doesn't exist

**No Response Display:**
- Problem: No UI to show advice/response from API
- Blocks: Even after OpenAI integration, users won't see results
- Scope: MVP critical
- Risk level: High

## Fragile Areas

**DOM Query Non-Null Assertion:**
- Files: `src/main.tsx` line 6
- Why fragile: `document.getElementById('root')!` uses TypeScript non-null assertion without runtime check. If `id="root"` is removed from `index.html` or renamed, app crashes silently in production
- Safe modification: Replace non-null assertion with runtime check or initialization wrapper that provides clear error message if element missing
- Current safety: None - will throw at runtime if element not found
- Test coverage: Zero - no tests exist to validate DOM setup

**Hardcoded Root Element ID:**
- Files: `index.html` line 10, `src/main.tsx` line 6
- Why fragile: String ID "root" appears in two places without centralized constant. Single typo breaks app silently
- Safe modification: Extract to constant in `src/main.tsx`, import in both locations. Or use data attribute query instead of ID
- Risk: High for early-stage project before test infrastructure added

## Security Considerations

**No Security Headers in HTML:**
- Risk: `index.html` lacks security headers (Content-Security-Policy, X-Content-Type-Options, etc.). When this app connects to OpenAI API, tokens/keys could be exposed through missing HTTP security headers
- Files: `index.html`
- Current mitigation: None at HTML level; depends entirely on server configuration (not yet defined)
- Recommendations: Add Meta tags or configure server with security headers before adding API integration. Document which headers are needed when backend is built.

**API Credentials Exposure Risk:**
- Risk: When OpenAI API is integrated, credentials must live somewhere (env vars, backend proxy, or frontend). Frontend storage would be a security vulnerability
- Files: Not yet present - but critical before integration
- Current mitigation: Unknown - no backend or env var usage pattern exists yet
- Recommendations: Plan backend proxy approach before adding OpenAI integration. Never store API keys in frontend code or localStorage. Use environment-gated backend endpoints that authenticate with OpenAI on behalf of frontend.

**No CORS Configuration:**
- Risk: If frontend calls OpenAI API directly from browser, CORS preflight requests expose API intent; backend must proxy to hide credentials
- Files: Not yet relevant, but architecture decision needed
- Current mitigation: None
- Recommendations: Decide on CORS/proxy strategy as part of API integration phase. Recommend backend proxy model for production.

## Performance Bottlenecks

**Unoptimized React Setup:**
- Problem: App uses React 19.2.0 with StrictMode but no code splitting, lazy loading, or performance monitoring
- Files: `src/main.tsx`
- Cause: Early-stage project; performance not yet a focus
- Current impact: Not blocking MVP but will matter once chat history or multiple API calls added
- Improvement path: Add React.lazy() for route splitting once routing is implemented; add performance monitoring (Sentry/Datadog) once backend API integration happens

## Test Coverage Gaps

**Zero Test Infrastructure:**
- What's not tested: All components, API integration (when added), error handling, edge cases
- Files: No test files exist; no Jest/Vitest config despite Vite being the build tool
- Risk: Cannot safely refactor CSS/HTML; no guardrails for form validation or API error handling (when added)
- Priority: Medium - should add before API integration to prevent silent failures with API responses

**No Type Safety for DOM:**
- What's not tested: DOM queries and React root mounting are untyped beyond TypeScript's JSX type
- Files: `src/main.tsx`
- Risk: Non-null assertions hide runtime errors; no validation that HTML structure matches expected IDs
- Priority: Low for MVP, Medium once scaled

**No E2E Tests:**
- What's not tested: User flow (ask question → receive answer) will have zero e2e coverage when implemented
- Files: Will be needed in test directory (doesn't exist)
- Risk: Regressions in user flow undetected; OpenAI integration bugs not caught before production
- Priority: High - should add before first API integration test

## Scaling Limits

**No Backend:**
- Current capacity: Can serve static HTML/CSS/JS only
- Limit: Cannot proxy API calls, handle rate limiting, or manage credentials securely
- Scaling path: Build Express/Node backend or equivalent before adding OpenAI integration; add database if chat history is added later

**No Environment Configuration:**
- Current capacity: App is hardcoded for development; no env var support
- Limit: Cannot change API endpoints or configuration between dev/staging/production; secrets have nowhere to live
- Scaling path: Implement .env file support using Vite's `import.meta.env`; document required vars in README

**Single Page Component:**
- Current capacity: Everything lives in `src/App.tsx` with inline styles
- Limit: Cannot scale component count; adding 5+ components will make App.tsx unmaintainable
- Scaling path: Create component directory structure (e.g., `src/components/QuestionForm.tsx`, `src/components/ResponseDisplay.tsx`) with shared styling strategy before adding Q&A flow

---

*Concerns audit: 2026-02-13*
