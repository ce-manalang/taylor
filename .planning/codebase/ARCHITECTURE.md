# Architecture

**Analysis Date:** 2026-02-13

## Pattern Overview

**Overall:** Simple client-side React SPA with planned backend integration

**Key Characteristics:**
- Lightweight, minimal-complexity design philosophy
- Client-side rendering with React 19 and Vite
- TypeScript for type safety
- Single entry point with room for component growth
- Planned integration with OpenAI agent for advice generation

## Layers

**Presentation Layer:**
- Purpose: Render user interface and handle user interactions
- Location: `src/App.tsx`, `src/main.tsx`, `src/assets/`
- Contains: React components, global styles, client setup
- Depends on: React, React DOM
- Used by: Browser/DOM

**Application Entry Point:**
- Purpose: Initialize React application and mount to DOM
- Location: `src/main.tsx`
- Contains: React StrictMode wrapper, root element mounting
- Depends on: React, React DOM, App component
- Used by: `index.html` script tag

**Root Component:**
- Purpose: Main application shell and layout
- Location: `src/App.tsx`
- Contains: Main UI structure, future question form and response display
- Depends on: React, global styles
- Used by: `main.tsx` root render

## Data Flow

**Current State (MVP):**

The application currently displays a static title. The planned data flow will be:

1. User enters question in form
2. Submit triggers API call to backend (planned OpenAI agent)
3. Backend processes question and generates emotional response
4. Response returned and displayed in UI
5. User sees single, focused answer

**State Management:**

Currently no state management tool. As functionality grows:
- Form state (question input) will use React `useState`
- Response display will use React `useState`
- Loading state for API calls will use React `useState`
- No persistence needed for MVP (no chat history)

## Key Abstractions

**React Component (App):**
- Purpose: Main application interface
- Examples: `src/App.tsx`
- Pattern: Functional component with hooks

**Styling Pattern:**
- Purpose: Separate CSS for component styling
- Examples: `src/App.css` (component), `src/index.css` (global)
- Pattern: Co-located CSS files next to components

## Entry Points

**HTML Entry Point:**
- Location: `index.html`
- Triggers: Browser loads page
- Responsibilities: Mount point with `<div id="root">`, script loader for `main.tsx`

**React Entry Point:**
- Location: `src/main.tsx`
- Triggers: Loaded by `index.html` script
- Responsibilities: Import App, create React root, render to DOM with StrictMode

**Application Logic:**
- Location: `src/App.tsx`
- Triggers: Rendered by `main.tsx`
- Responsibilities: Main UI structure, form handling (planned), response display (planned)

## Error Handling

**Strategy:** Minimal for MVP - focus on graceful degradation

**Patterns:**
- TypeScript strict mode prevents undefined errors at compile time
- React StrictMode enables additional development checks
- No error boundaries currently implemented - to be added when async operations begin

## Cross-Cutting Concerns

**Logging:** Not implemented (no backend integration yet)

**Validation:** Not needed for MVP (single user input to be added later)

**Authentication:** Not needed for MVP (stateless single-question pattern)

**Styling:** Global base styles in `src/index.css`, component-specific overrides in `src/App.css`

---

*Architecture analysis: 2026-02-13*
