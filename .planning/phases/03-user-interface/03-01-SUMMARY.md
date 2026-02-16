---
phase: 03-user-interface
plan: 01
subsystem: ui
tags: [react, css, google-fonts, typewriter-animation, design-system, clipboard-api]

requires:
  - phase: 02-core-matching
    provides: API client and response types for matching endpoint
provides:
  - Design system CSS custom properties (color palette, typography, transitions)
  - Google Fonts loading (Lora serif + Inter sans-serif)
  - QuestionInput component (pill-shaped text input with send icon)
  - LoadingDots component (three pulsing dots loading indicator)
  - StarterQuestions component (three vulnerable question chips)
  - LyricDisplay component (typewriter animation with blinking cursor)
  - CopyButton component (clipboard copy with confirmation feedback)
affects: [03-02-app-assembly]

tech-stack:
  added: [Google Fonts (Lora, Inter)]
  patterns: [CSS custom properties design system, co-located CSS per component, vanilla CSS animations, character-by-character JS typewriter]

key-files:
  created:
    - src/components/QuestionInput.tsx
    - src/components/QuestionInput.css
    - src/components/LoadingDots.tsx
    - src/components/LoadingDots.css
    - src/components/StarterQuestions.tsx
    - src/components/StarterQuestions.css
    - src/components/LyricDisplay.tsx
    - src/components/LyricDisplay.css
    - src/components/CopyButton.tsx
    - src/components/CopyButton.css
  modified:
    - index.html
    - src/index.css

key-decisions:
  - "Character-by-character JS typewriter (not CSS width animation) for multi-line lyric support"
  - "Derive animation 'done' state from displayedChars count to satisfy React 19 strict lint rules"
  - "All setState calls in effects wrapped in setTimeout/setInterval callbacks (React 19 set-state-in-effect rule)"
  - "Smart curly quote in starter question text for typographic polish"

patterns-established:
  - "Co-located CSS: each component has a matching .css file imported at top"
  - "CSS custom properties for all colors, fonts, transitions -- no hardcoded values in components"
  - "All animation keyframes defined globally in index.css, referenced by component CSS"
  - "prefers-reduced-motion handled both globally (index.css override) and per-component (LyricDisplay JS check)"

duration: 4min
completed: 2026-02-16
---

# Phase 3 Plan 01: Design System & UI Components Summary

**Soft neutral design system with Lora/Inter fonts and 5 typed React components: QuestionInput, LoadingDots, StarterQuestions, LyricDisplay (typewriter), CopyButton (clipboard)**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-16T09:59:21Z
- **Completed:** 2026-02-16T10:03:25Z
- **Tasks:** 3
- **Files modified:** 12

## Accomplishments
- Complete design system with CSS custom properties: soft neutral palette (#FDFCFA warm white, #C9ADA7 rose accent), Lora serif + Inter sans-serif, transition timing functions
- 5 self-contained React components with co-located CSS, all typed with TypeScript interfaces
- LyricDisplay typewriter with 40ms/char animation (clamped 1-4s), blinking cursor, reduced-motion support
- CopyButton with navigator.clipboard.writeText and 2-second "Copied" confirmation with icon swap
- StarterQuestions with 3 emotionally resonant prompts ("Am I wasting my time on someone who doesn't care?", "Will this feeling ever pass?", "Am I strong enough to start over?")

## Task Commits

Each task was committed atomically:

1. **Task 1: Design system foundation** - `eb8bc96` (feat)
2. **Task 2: QuestionInput, LoadingDots, StarterQuestions** - `9517a04` (feat)
3. **Task 3: LyricDisplay, CopyButton** - `0de1c17` (feat)

## Files Created/Modified
- `index.html` - Added Google Fonts preconnect + Lora/Inter stylesheet, updated title
- `src/index.css` - Complete design system: CSS custom properties, base reset, animation keyframes, reduced-motion override
- `src/components/QuestionInput.tsx` - Pill-shaped input with "Ask Taylor..." placeholder and send arrow SVG
- `src/components/QuestionInput.css` - Input wrapper styling with focus-within accent, compact mode
- `src/components/LoadingDots.tsx` - Three-dot loading with role="status" and aria-label
- `src/components/LoadingDots.css` - Staggered pulse-dot animation (0s, 0.2s, 0.4s delays)
- `src/components/StarterQuestions.tsx` - Three question chips with type="button" and staggered fade-in
- `src/components/StarterQuestions.css` - Chip styling with hover/active states, mobile vertical stack
- `src/components/LyricDisplay.tsx` - Typewriter animation via setInterval, reduced-motion support
- `src/components/LyricDisplay.css` - Lora serif text, blinking cursor with done state
- `src/components/CopyButton.tsx` - Clipboard copy with copied state and icon swap
- `src/components/CopyButton.css` - Subtle button with hover and copied accent color

## Decisions Made
- **JS typewriter over CSS width animation:** Lyrics can be 1-2 lines and may wrap, so CSS `steps()` with `overflow: hidden; white-space: nowrap` would clip multi-line text. JS character-by-character approach handles any lyric length naturally.
- **React 19 strict lint compliance:** The `react-hooks/set-state-in-effect` rule prohibits synchronous setState in useEffect bodies. Resolved by moving all state updates into setTimeout/setInterval callbacks, which are async and lint-clean.
- **Smart quotes in starter questions:** Used Unicode right single quotation mark (U+2019) in "doesn't" for typographic polish matching the warm/literary aesthetic.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed LyricDisplay lint violations for React 19 strict hooks rules**
- **Found during:** Task 3 (LyricDisplay implementation)
- **Issue:** React 19's `react-hooks/set-state-in-effect` rule flags synchronous setState calls in useEffect body. Initial implementation called `setDone(false)` and `setDisplayedChars(0)` synchronously for state reset.
- **Fix:** Restructured to use setTimeout(0) for state reset and setInterval callbacks for animation ticks -- all setState calls happen in async timer callbacks, satisfying the linter.
- **Files modified:** src/components/LyricDisplay.tsx
- **Verification:** `npm run lint` passes with zero new errors
- **Committed in:** 0de1c17 (Task 3 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Necessary for lint compliance. No scope creep. Same behavior, just restructured to satisfy React 19 strict mode.

## Issues Encountered
- Pre-existing lint errors exist in `api/ask.ts` (2 `@typescript-eslint/no-explicit-any` from Phase 2). These are unrelated to this plan and were not modified.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- All 5 components are ready for Plan 03-02 to wire together in App.tsx
- Components export named functions with typed props interfaces
- Design system CSS variables available globally via index.css
- No App.tsx modifications were made (reserved for Plan 02)

## Self-Check: PASSED

All 12 files verified present. All 3 task commits verified in git log.

---
*Phase: 03-user-interface*
*Completed: 2026-02-16*
