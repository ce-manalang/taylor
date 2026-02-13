# Codebase Structure

**Analysis Date:** 2026-02-13

## Directory Layout

```
taylor/
├── src/                    # Main application source code
│   ├── App.tsx             # Root application component
│   ├── App.css             # Root component styles
│   ├── main.tsx            # React entry point
│   ├── index.css           # Global base styles
│   └── assets/             # Static assets (images, SVGs)
├── public/                 # Static files served directly
│   └── vite.svg            # Vite favicon
├── index.html              # HTML entry point
├── package.json            # Project dependencies and scripts
├── tsconfig.json           # TypeScript base config
├── tsconfig.app.json       # TypeScript app-specific config
├── tsconfig.node.json      # TypeScript Node/build config
├── vite.config.ts          # Vite build configuration
├── eslint.config.js        # ESLint configuration
└── .planning/              # GSD planning documents
    └── codebase/           # Architecture and structure docs
        ├── STACK.md
        ├── ARCHITECTURE.md
        └── STRUCTURE.md
```

## Directory Purposes

**src/:**
- Purpose: All TypeScript/React source code for the application
- Contains: React components, styles, entry points
- Key files: `App.tsx`, `main.tsx`

**src/assets/:**
- Purpose: Local static assets and images
- Contains: SVGs, PNGs, or other media assets
- Currently: Empty, ready for future icons or illustrations

**public/:**
- Purpose: Static files copied directly to build output without processing
- Contains: Assets that don't need bundling
- Key files: `vite.svg` (favicon)

**.planning/codebase/:**
- Purpose: GSD mapping documents for codebase analysis
- Contains: Architecture, structure, conventions, testing, stack, and concerns documentation
- Not committed as code artifacts (informational only)

## Key File Locations

**Entry Points:**
- `index.html`: HTML document root - loads main.tsx script and provides `<div id="root">` mount point
- `src/main.tsx`: React application entry - creates root and renders App component
- `src/App.tsx`: Root React component - main UI shell for application

**Configuration:**
- `package.json`: Project metadata, dependencies, and npm scripts
- `tsconfig.app.json`: TypeScript compiler options for application code (target: ES2022, module: ESNext, jsx: react-jsx)
- `vite.config.ts`: Vite bundler configuration with React plugin
- `eslint.config.js`: ESLint rules for code quality (TypeScript, React hooks, React Refresh)

**Core Logic:**
- `src/App.tsx`: Currently static title display, will hold form and response logic
- `src/main.tsx`: Application initialization and mounting

**Styling:**
- `src/index.css`: Global base styles and color scheme (light/dark mode)
- `src/App.css`: Component-specific styles for App layout

## Naming Conventions

**Files:**
- React components: PascalCase with `.tsx` extension (e.g., `App.tsx`)
- Styles: Match component name with `.css` extension (e.g., `App.css`)
- Config files: lowercase with dot-notation (e.g., `tsconfig.app.json`, `eslint.config.js`)
- Entry points: `main.tsx` for React entry, `index.html` for HTML entry

**Directories:**
- Source code: `src/` (lowercase)
- Public assets: `public/` (lowercase)
- Subdirectories within src: Lowercase descriptive names (e.g., `assets/`)

## Where to Add New Code

**New Feature (Question/Response):**
- Primary code: Create new component file in `src/` (e.g., `src/QuestionForm.tsx`, `src/ResponseDisplay.tsx`)
- Tests: Co-locate test file with component (e.g., `src/QuestionForm.test.tsx`)
- Styles: Separate CSS file matching component (e.g., `src/QuestionForm.css`)
- Integration: Import and use within `src/App.tsx`

**New Component/Module:**
- Implementation: Create new `.tsx` file in `src/` (use PascalCase)
- Keep related logic together: Component, styles, and tests in same directory level
- Export from component: `export default ComponentName;`

**Utilities and Helpers:**
- Shared helpers: Create `src/utils/` directory for pure functions (e.g., `src/utils/formatting.ts`)
- API/Service layer (planned): Create `src/services/` directory for OpenAI integration (e.g., `src/services/ai.ts`)
- Constants: Create `src/constants.ts` or directory if multiple files needed

**Styles:**
- Global utilities: Add to `src/index.css`
- Component-specific: Keep in co-located `.css` file (e.g., `src/QuestionForm.css`)
- Avoid: Don't create separate theme files until design grows beyond current simplicity

## Special Directories

**node_modules/:**
- Purpose: Installed npm dependencies
- Generated: Yes (from package.json via npm install)
- Committed: No (listed in .gitignore)

**dist/:**
- Purpose: Build output directory (created by Vite)
- Generated: Yes (from npm run build)
- Committed: No (listed in .gitignore)

**.git/:**
- Purpose: Git repository metadata
- Generated: Yes (initialized with git init)
- Committed: Yes (internal git directory)

**.planning/codebase/:**
- Purpose: GSD planning and analysis documents
- Generated: Yes (created by /gsd:map-codebase)
- Committed: Yes (informational documents)

## Build and Dev Structure

**Development:**
- Run: `npm run dev` → starts Vite dev server at http://localhost:5173
- Vite provides fast HMR (Hot Module Replacement) for React development
- TypeScript checking: `npm run build` runs `tsc -b` before bundling

**Production Build:**
- Command: `npm run build`
- Process: TypeScript compilation → Vite bundle → `dist/` output
- Output: Optimized, minified code ready for deployment

**Linting:**
- Command: `npm run lint`
- Tool: ESLint with TypeScript and React plugin support
- Enforces: TypeScript strict mode, React hooks rules, code quality standards

---

*Structure analysis: 2026-02-13*
