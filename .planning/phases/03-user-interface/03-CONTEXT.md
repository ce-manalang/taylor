# Phase 3: User Interface - Context

**Gathered:** 2026-02-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Complete end-to-end user experience from question to lyric. User types a life question, sees a loading state, receives a Taylor Swift lyric with a reveal animation, and can copy it. Includes starter questions for inspiration. Mobile responsive, soft/warm/calm aesthetic — "trusted friend after midnight" tone.

</domain>

<decisions>
## Implementation Decisions

### Visual Tone & Aesthetic
- Light mode — soft whites, not dark/moody
- Soft neutral palette — warm whites, light grays, subtle beige. Minimal and clean.
- Serif font for lyric display (literary, poetic feel), sans-serif for everything else
- Ultra minimal layout — centered single column, lots of whitespace, almost nothing on screen except the question and lyric

### Question Input & Flow
- Input centered on screen (vertically + horizontally) — the input IS the page, like a search engine
- After submit: input shrinks/animates up to make room for lyric in the center
- Submit via Enter key + subtle send icon inside the input (both work, icon needed for mobile)
- Placeholder text: "Ask Taylor..."

### Lyric Reveal & Display
- Typewriter animation — letters appear one by one, like someone typing a response
- Medium, elegant sizing — comfortably readable but not overwhelming, like reading a note
- Copy button below the lyric — small icon or text link, unobtrusive
- Loading state: subtle three-dots pulsing animation (like someone thinking before responding)

### Starter Questions
- 3 starter questions shown below the input
- Tapping a starter fills the input field (doesn't auto-submit) — user can edit or hit enter
- Tone: vulnerable & real — "Am I good enough?" / "Will this feeling pass?" — questions people actually ask at midnight
- Claude authors the specific 3 starter questions

### Claude's Discretion
- Exact color hex values within the soft neutral palette
- Sans-serif font choice for UI elements
- Serif font choice for lyric display
- Typewriter animation speed
- Copy button icon choice and confirmation feedback (toast, checkmark, etc.)
- Three-dots animation implementation
- Input shrink/move animation details (duration, easing)
- Starter question chip styling
- Mobile breakpoints and touch target sizing
- How "ask another" works after seeing a lyric (return to initial state vs inline reset)

</decisions>

<specifics>
## Specific Ideas

- The initial screen should feel like opening a blank journal — quiet, inviting, nothing demanding attention
- The typewriter effect should feel like someone writing back to you, not like a terminal cursor
- Starter questions are the kind of thing you'd text your best friend at 2am
- After the lyric appears, the screen should feel like a moment of stillness — not rushed to ask again

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-user-interface*
*Context gathered: 2026-02-16*
