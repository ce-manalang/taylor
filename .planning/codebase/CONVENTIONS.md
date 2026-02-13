# Coding Conventions

**Analysis Date:** 2026-02-13

## Naming Patterns

**Files:**
- Components: PascalCase (e.g., `App.tsx`)
- Entry points: lowercase (e.g., `main.tsx`)
- CSS files: match component name or purpose (e.g., `App.css`, `index.css`)

**Functions:**
- React components: PascalCase (e.g., `App`)
- Regular functions: camelCase (inferred from React standards)
- Event handlers: camelCase with `handle` prefix (convention based on React patterns)

**Variables:**
- camelCase for all variable declarations
- UPPERCASE for constants (not observed in codebase yet, but standard TypeScript practice)

**Types:**
- React components: PascalCase function names
- Props and interfaces: PascalCase (TypeScript standard)

## Code Style

**Formatting:**
- Inferred from ESLint configuration and TypeScript setup
- No Prettier config file present, using ESLint defaults
- Single quotes likely (standard in modern JS/TS projects)

**Linting:**
- ESLint with TypeScript support enabled (`typescript-eslint`)
- Includes React Hooks and React Refresh linting
- Config location: `eslint.config.js`

**Key ESLint Rules Applied:**
- `@eslint/js` recommended config
- `typescript-eslint` recommended config
- `eslint-plugin-react-hooks` - enforces Rules of Hooks
- `eslint-plugin-react-refresh` - ensures Vite React refresh compatibility
- Browser globals enabled (ES2020+)

## Import Organization

**Order:**
1. React/library imports (e.g., `import { StrictMode } from 'react'`)
2. Relative imports (e.g., `import './index.css'`)
3. Component imports (e.g., `import App from './App.tsx'`)

**Pattern Observed in `main.tsx`:**
```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
```

**Path Aliases:**
- Not configured in current codebase
- `moduleResolution: "bundler"` in `tsconfig.app.json` allows modern module resolution

## Error Handling

**Patterns:**
- Not extensively demonstrated in minimal codebase
- Non-null assertion used where necessary (e.g., `document.getElementById('root')!` in `main.tsx`)
- TypeScript strict mode enables compile-time error catching

## Logging

**Framework:** `console` (no custom logging library configured)

**Patterns:**
- Not observed in current codebase
- Default: use `console.log()`, `console.error()`, etc. when needed
- Focus on minimal debugging in MVP phase

## Comments

**When to Comment:**
- Not extensively demonstrated in minimal codebase
- Code is self-documenting where possible
- Comments should explain "why" not "what"

**JSDoc/TSDoc:**
- Not required in MVP phase
- Recommended for public APIs once codebase grows

## Function Design

**Size:** Functions should be small and focused
- Example: `App` component is 11 lines with clear single responsibility
- `main.tsx` is 10 lines for setup only

**Parameters:** Named parameters preferred, destructuring used for props
- Example: `function App()` - no parameters for this simple component

**Return Values:**
- React components return JSX.Element
- Clear, consistent return types enforced by TypeScript

## Module Design

**Exports:**
- Default exports for React components (e.g., `export default App`)
- CSS files imported for styling
- Single responsibility per component file

**Barrel Files:**
- Not currently used (project too small)
- When needed, consolidate related exports in `index.ts` files

## Styling Approach

**CSS:**
- Component-scoped CSS files (e.g., `App.tsx` paired with `App.css`)
- Inline styles used for dynamic styling (observed in `App.tsx` with `style={{}}`)
- Global styles in `index.css`
- CSS Modules pattern not currently used but could be introduced

**Pattern:**
```typescript
// From App.tsx
<main
  style={{
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "system-ui, sans-serif",
  }}
>
```

Inline styles used for layout-critical declarations; regular CSS for hover states and animations.

## TypeScript Strictness

**Compiler Settings (tsconfig.app.json):**
- `strict: true` - All strict type checks enabled
- `noUnusedLocals: true` - Error on unused variables
- `noUnusedParameters: true` - Error on unused parameters
- `noFallthroughCasesInSwitch: true` - Error on missing switch cases
- `noUncheckedSideEffectImports: true` - Warn about unsafe side effect imports

This means:
- All imports must be used or explicitly ignored
- All parameters must be used
- Type safety is enforced at compile time
- No implicit `any` types allowed

---

*Convention analysis: 2026-02-13*
