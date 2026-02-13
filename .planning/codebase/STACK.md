# Technology Stack

**Analysis Date:** 2026-02-13

## Languages

**Primary:**
- TypeScript 5.9.3 - Full codebase with strict typing enabled
- JavaScript/JSX - React component syntax via TypeScript's JSX preset

**Secondary:**
- CSS - Styling (minimal, intentional simplicity)
- HTML - Document markup via Vite

## Runtime

**Environment:**
- Node.js (version not specified in lock files, using current LTS expected)

**Package Manager:**
- npm (Node Package Manager)
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- React 19.2.0 - UI library and component framework
  - React DOM 19.2.0 - DOM rendering
  - react-jsx runtime enabled via TypeScript configuration

**Build/Dev:**
- Vite 7.2.4 - Frontend build tool and dev server
  - @vitejs/plugin-react 5.1.1 - React integration for Vite
  - tsc (TypeScript Compiler) - Builds TypeScript before Vite bundling via `tsc -b`

**Linting:**
- ESLint 9.39.1 - Code quality and style checking
  - @eslint/js 9.39.1 - Core ESLint rules
  - typescript-eslint 8.46.4 - TypeScript linting support
  - eslint-plugin-react-hooks 7.0.1 - React Hooks rules
  - eslint-plugin-react-refresh 0.4.24 - React refresh compatibility
  - globals 16.5.0 - Global variable definitions for environments

## Key Dependencies

**Critical:**
- react 19.2.0 - UI rendering engine
- react-dom 19.2.0 - React browser DOM bindings

**Development:**
- typescript ~5.9.3 - Type checking and transpilation
- vite 7.2.4 - Development server and production bundler (handles both transpilation and bundling)
- @vitejs/plugin-react 5.1.1 - Enables JSX and Fast Refresh for React development

## Configuration

**Environment:**
- No `.env` files present
- Configuration is static via `vite.config.ts`
- TypeScript strict mode enabled in `tsconfig.app.json`

**Build:**
- `vite.config.ts` - Main Vite configuration with React plugin
- `tsconfig.json` - TypeScript project references (points to app and node configs)
- `tsconfig.app.json` - Application TypeScript settings (strict mode, JSX, ES2022 target)
- `tsconfig.node.json` - TypeScript settings for build scripts (Node environment)
- `eslint.config.js` - ESLint configuration using flat config format

## Platform Requirements

**Development:**
- Node.js (current version, LTS recommended)
- npm installed
- Modern browser with ES2022 support

**Production:**
- Static hosting (Vite builds to `dist/` directory)
- Browser with ES2022 JavaScript support
- No backend or server required for MVP

## Build and Run Commands

**Development:**
- `npm run dev` - Start Vite dev server (hot reload enabled)
- `npm run build` - Type check with tsc then bundle with Vite
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint on all files

---

*Stack analysis: 2026-02-13*
