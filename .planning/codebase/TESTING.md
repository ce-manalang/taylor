# Testing Patterns

**Analysis Date:** 2026-02-13

## Test Framework

**Status:** Not currently configured

**Runner:**
- No test runner installed (Jest, Vitest, etc. not in `package.json`)
- Recommended: Vitest (lightweight, Vite-native, fast)

**Assertion Library:**
- Not configured
- Recommended with Vitest: Vitest built-in or `@testing-library/react`

**Run Commands:**
- Currently unavailable
- Suggested commands once testing is set up:
```bash
npm run test              # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

## Test File Organization

**Current State:**
- No test files exist in `/Volumes/Workspace/weekend/taylor/src`
- Project is in MVP phase with minimal components

**Recommended Location:**
- Co-located with components (preferred pattern)
- Example structure when testing is added:
```
src/
├── App.tsx
├── App.test.tsx         # Test file alongside component
├── components/
│   ├── Question.tsx
│   └── Question.test.tsx
```

**Naming:**
- Pattern: `[ComponentName].test.tsx` or `[ComponentName].spec.tsx`
- Recommended: `.test.tsx` for consistency with Vite defaults

## Test Structure

**Recommended Suite Organization:**

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders heading', () => {
    render(<App />)
    expect(screen.getByText(/WWTS/i)).toBeInTheDocument()
  })
})
```

**Patterns to Follow:**
- One `describe()` block per component
- One `it()` per test case (clear test names)
- Setup with `render()` from `@testing-library/react`
- Assertions with `expect()`

**Teardown:**
- Automatic with Vitest + React Testing Library
- No manual cleanup needed with modern test utilities

## Mocking

**Framework:** Not yet configured
- Recommended: Vitest's built-in mocking or `vi` utility

**When to Mock:**
- External API calls (OpenAI agent calls planned in README)
- Child components (when testing parent in isolation)
- Window/document APIs if needed

**What NOT to Mock:**
- React components that are part of the feature being tested
- Built-in DOM methods (use actual DOM with RTL)
- User interaction (use `userEvent` from `@testing-library/user-event`)

**Recommended Pattern:**

```typescript
import { describe, it, expect, vi } from 'vitest'

describe('openAI integration', () => {
  it('calls API with question', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: async () => ({ response: 'advice' })
    })
    global.fetch = mockFetch

    // ... test code

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api')
    )
  })
})
```

## Fixtures and Test Data

**Current Need:**
- Not yet needed for MVP (minimal components)
- Will be needed once API integration is added

**Recommended Pattern for Future:**

Create test fixtures in `src/__tests__/fixtures/`:

```typescript
// src/__tests__/fixtures/mockResponses.ts
export const mockApiResponse = {
  question: 'Why do I feel lost?',
  response: 'Sometimes feeling lost is where growth begins...'
}

export const mockError = {
  status: 500,
  message: 'API error'
}
```

Then use in tests:

```typescript
import { mockApiResponse } from '../__tests__/fixtures/mockResponses'

describe('QuestionForm', () => {
  it('displays API response', async () => {
    vi.mocked(fetchAdvice).mockResolvedValue(mockApiResponse)
    // ...
  })
})
```

## Coverage

**Requirements:** Not enforced
- Recommended minimum for MVP: 70% statements
- Critical paths (OpenAI integration, user interaction) should reach 90%+

**View Coverage:**
```bash
npm run test:coverage
```

Coverage report location (once configured):
```
coverage/
├── index.html
└── [detailed reports]
```

## Test Types

**Unit Tests:**
- Scope: Individual functions and simple components
- Approach: Test in isolation using mocks for dependencies
- Example: Test form validation logic, helper functions
- File location: Same directory as source, `.test.tsx` suffix

**Integration Tests:**
- Scope: Multiple components working together
- Approach: Render component tree, verify interaction
- Example: Test form submission → API call → response display
- File location: `src/__tests__/integration/` when added

**E2E Tests:**
- Framework: Not used in MVP
- Recommended future: Playwright or Cypress
- When to add: After API integration is stable

**Example Integration Test (Future):**

```typescript
describe('Question to Answer Flow', () => {
  it('submits question and displays response', async () => {
    render(<App />)

    const input = screen.getByRole('textbox')
    const submitBtn = screen.getByRole('button', { name: /send/i })

    await userEvent.type(input, 'What does healing look like?')
    await userEvent.click(submitBtn)

    await expect(
      screen.findByText(/sometimes healing/i)
    ).resolves.toBeInTheDocument()
  })
})
```

## Common Patterns

**Async Testing:**

```typescript
it('fetches and displays data', async () => {
  render(<QuestionForm />)
  const input = screen.getByRole('textbox')

  await userEvent.type(input, 'my question')
  await userEvent.click(screen.getByRole('button'))

  // Wait for async response
  const response = await screen.findByText(/response text/i)
  expect(response).toBeInTheDocument()
})
```

**Error Testing:**

```typescript
it('handles API errors gracefully', async () => {
  vi.mocked(fetchAdvice).mockRejectedValue(
    new Error('Network error')
  )

  render(<App />)
  // ... trigger the error path

  expect(screen.getByText(/something went wrong/i))
    .toBeInTheDocument()
})
```

**React Hooks Testing:**

Once custom hooks are created (for API calls, state management):

```typescript
import { renderHook, act } from '@testing-library/react'
import { useQuestion } from './useQuestion'

it('updates question state', () => {
  const { result } = renderHook(() => useQuestion())

  act(() => {
    result.current.setQuestion('new question')
  })

  expect(result.current.question).toBe('new question')
})
```

## Setup When Adding Tests

**1. Install dependencies:**
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

**2. Create `vitest.config.ts`:**
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/vitest.setup.ts'],
  },
})
```

**3. Add to `package.json` scripts:**
```json
{
  "test": "vitest",
  "test:watch": "vitest --watch",
  "test:coverage": "vitest --coverage"
}
```

**4. Create `src/vitest.setup.ts`:**
```typescript
import '@testing-library/jest-dom'
```

---

*Testing analysis: 2026-02-13*
