# Stack Research

**Domain:** OpenAI-powered lyric matching web app
**Researched:** 2026-02-13
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| React | 19.2.0 (existing) | Frontend UI framework | Already in place; React 19 provides excellent TypeScript support and is the industry standard for interactive UIs |
| Vite | 7.2.4 (existing) | Build tool & dev server | Already configured; fast HMR, native ESM, excellent TypeScript support |
| TypeScript | 5.9.3 (existing) | Type safety | Already configured; essential for maintainable API integration code |
| OpenAI SDK | ^6.21.0 | OpenAI API client | Official SDK with TypeScript support, handles authentication, streaming, embeddings |
| Serverless Functions | Platform-specific | Backend proxy for API | Keeps API keys secure; prevents client-side exposure; enables rate limiting |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `openai` | ^6.21.0 | Text embeddings generation | Generate embeddings for lyrics dataset and user queries for semantic matching |
| `@types/node` | ^24.10.1 (existing) | Node.js type definitions | Required for environment variable typing and serverless function development |
| `compute-cosine-similarity` | ^1.1.0 | Vector similarity computation | Calculate similarity between user query embedding and lyric embeddings (client-side or serverless) |

### Optional Enhancement Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Vercel AI SDK (`ai`) | ^6.0.85 | Unified AI provider interface | If you want provider-agnostic code or advanced streaming features; **NOT required for simple text matching** |
| `transformers.js` | Latest | Browser-based embeddings | If you want to avoid API costs by running embeddings in-browser; **adds complexity, not recommended for MVP** |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| `.env` files | Environment variable management | Use `.env.local` for API keys (git-ignored), never prefix sensitive keys with `VITE_` |
| ESLint | Code linting (existing) | Already configured; maintain existing setup |
| TypeScript | Type checking (existing) | Create `vite-env.d.ts` for custom env var types |

## Installation

```bash
# OpenAI SDK (for serverless function or embeddings generation)
npm install openai

# Cosine similarity for matching
npm install compute-cosine-similarity

# TypeScript types (already installed, but included for completeness)
npm install -D @types/node
```

## Architecture Pattern: Backend-for-Frontend (BFF)

### Recommended Approach for WWTS

```
User Browser (React App)
    ↓ POST /api/match-lyric
Serverless Function (Netlify/Vercel)
    ↓ Uses OPENAI_API_KEY from secure env
OpenAI API (embeddings endpoint)
    ↓ Returns embedding vector
Serverless Function
    ↓ Computes cosine similarity against lyrics dataset
    ↓ Returns best matching lyric
User Browser
```

**Why this pattern:**
- API keys never touch client code
- No risk of key exposure in browser DevTools
- Enables rate limiting per user/IP
- Minimal infrastructure complexity
- Costs ~$0 for low traffic (free tier on Netlify/Vercel)

### Alternative: Pre-computed Embeddings + Client-side Matching

For a simpler MVP with minimal API costs:
1. Pre-compute embeddings for all lyrics once (offline script)
2. Bundle embeddings JSON with app
3. Send user query to serverless function for embedding generation only
4. Perform cosine similarity matching client-side with `compute-cosine-similarity`

**Tradeoff:** Embeddings JSON increases bundle size (~4KB per lyric with 1536-dim embeddings)

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Serverless Functions (Netlify/Vercel) | Full backend (Express/Fastify) | If you need persistent connections, WebSockets, or complex business logic |
| OpenAI Embeddings API | Transformers.js (browser embeddings) | If API costs are prohibitive (unlikely for small dataset) or offline functionality required |
| `compute-cosine-similarity` | Manual implementation | Never—library is tiny, well-tested, and handles edge cases |
| Simple cosine similarity | Vector database (Pinecone, Qdrant) | Only if dataset exceeds 10,000+ lyrics or you need advanced filtering/metadata search |
| Vercel AI SDK | Direct OpenAI SDK | Vercel AI SDK adds abstractions for chat/streaming; unnecessary for simple embedding + similarity matching |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| API keys in frontend `.env` with `VITE_` prefix | Keys become visible in client bundle, exploitable via DevTools | Serverless function with API key in secure backend env vars |
| LangChain.js | Massive dependency for simple use case; adds 400KB+ to bundle | Direct OpenAI SDK + simple cosine similarity |
| Vector databases (Pinecone, Weaviate, Qdrant) | Overkill for <1000 lyrics; adds complexity, cost, and latency | In-memory search with pre-computed embeddings |
| `text-embedding-ada-002` model | Deprecated as of 2025; replaced by `text-embedding-3-small` | `text-embedding-3-small` (cheaper, faster, better performance) |
| Next.js API routes | Adds framework complexity for a simple Vite app | Platform-native serverless functions (Netlify/Vercel) |
| Full-stack frameworks (Remix, Next.js) | Re-architecture of existing React+Vite setup | Keep existing Vite app, add serverless function |

## Stack Patterns by Deployment Platform

### If deploying to Netlify:
- Use Netlify Functions (serverless functions in `/netlify/functions/`)
- Store `OPENAI_API_KEY` in Netlify environment variables (dashboard or `netlify.toml`)
- TypeScript serverless functions work out of the box with `@netlify/functions`

### If deploying to Vercel:
- Use Vercel Serverless Functions (files in `/api/` directory)
- Store `OPENAI_API_KEY` in Vercel environment variables (dashboard or `.env.local` + Vercel CLI)
- Excellent TypeScript support with zero config
- If using Vercel AI SDK later, you get native integration with OpenAI

### If deploying to static host (Cloudflare Pages, GitHub Pages):
- Must use external serverless platform (Netlify/Vercel functions, AWS Lambda, Cloudflare Workers)
- More complex setup; **recommend Netlify or Vercel for simplicity**

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| `openai@6.21.0` | Node.js 18+ | Requires ESM; works in Vite, Netlify Functions, Vercel Functions |
| `compute-cosine-similarity@1.x` | Any JavaScript environment | No dependencies, works client-side and server-side |
| React 19.2.0 | Vite 7.2.4 | Already compatible in your existing setup |

## Embedding Model Recommendation

| Model | Dimensions | Cost (per 1M tokens) | Use Case |
|-------|------------|---------------------|----------|
| `text-embedding-3-small` ⭐ | 1536 | $0.02 | **Recommended for WWTS** — Best balance of cost/performance |
| `text-embedding-3-large` | 3072 | $0.13 | Overkill for lyric matching; marginal quality improvement |

**For WWTS:** Use `text-embedding-3-small`. At 1536 dimensions, 500 lyrics + 1000 user queries = ~500K tokens = **$0.01 total cost**.

## Environment Variable Setup

### `.env.local` (local development, git-ignored):
```bash
# Serverless function uses this (NOT prefixed with VITE_)
OPENAI_API_KEY=sk-proj-...
```

### Vite TypeScript definitions (`vite-env.d.ts`):
```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Define frontend-safe env vars here (if any)
  // NEVER define OPENAI_API_KEY here — it's backend-only
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

### Serverless function (Netlify example):
```typescript
// netlify/functions/match-lyric.ts
import { Handler } from '@netlify/functions';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Securely accessed server-side
});

export const handler: Handler = async (event) => {
  const { question } = JSON.parse(event.body || '{}');

  const embedding = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: question,
  });

  // Compute similarity against lyrics dataset...

  return {
    statusCode: 200,
    body: JSON.stringify({ lyric: '...' }),
  };
};
```

## Security Checklist

- [ ] API keys stored in platform environment variables (Netlify/Vercel dashboard)
- [ ] No `VITE_` prefix on sensitive environment variables
- [ ] `.env.local` added to `.gitignore`
- [ ] Serverless function validates input (rate limiting, max length)
- [ ] CORS configured if needed (usually auto-configured by platform)
- [ ] No API keys committed to version control

## Cost Estimate (Monthly)

**For WWTS with 1000 queries/month:**
- Embeddings: 1000 queries × ~50 tokens/query = 50K tokens = **$0.001**
- Serverless functions: Free tier on Netlify/Vercel covers 100K invocations
- Hosting: Free tier on Netlify/Vercel

**Total: ~$0.01/month** (essentially free for MVP)

## Sources

**OpenAI SDK & Best Practices:**
- [OpenAI API Integration Guide (WEZOM)](https://wezom.com/blog/complete-openai-api-integration-guide-how-to-use-openai-in-your-projects)
- [OpenAI for Developers in 2025 (Official Blog)](https://developers.openai.com/blog/openai-for-developers-2025/)
- [GitHub: openai-node (Official SDK)](https://github.com/openai/openai-node)
- npm view for `openai@6.21.0` (verified via CLI, 2026-02-13)

**Architecture & Security:**
- [Building Production-Grade AI Chat Features in React (Medium)](https://medium.com/@mihirshahwrites/building-production-grade-ai-chat-features-in-react-the-architecture-nobody-talks-about-2ef1b5d1b63c)
- [Stop Leaking API Keys: The BFF Pattern (GitGuardian)](https://blog.gitguardian.com/stop-leaking-api-keys-the-backend-for-frontend-bff-pattern-explained/)
- [OpenAI API Security Best Practices (Help Center)](https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety)
- [Serverless Strategies with OpenAI (Medium)](https://medium.com/@sassenthusiast/serverless-strategies-with-openai-episode-1-secure-api-key-storage-and-access-00c91b74bc2a)

**Embeddings & Semantic Search:**
- [Vector embeddings (OpenAI Docs)](https://platform.openai.com/docs/guides/embeddings)
- [OpenAI Cookbook: Semantic Text Search](https://github.com/openai/openai-cookbook/blob/main/examples/Semantic_text_search_using_embeddings.ipynb)

**Vite Environment Variables:**
- [Env Variables and Modes (Vite Official Docs)](https://vite.dev/guide/env-and-mode)
- [How to Properly Handle Environment Variables in Vite with TypeScript (Medium)](https://medium.com/@bharath0292/how-to-properly-handle-environment-variables-in-vite-with-typescript-7e1cbf4c2cc9)

**Serverless Platforms:**
- [Vercel vs Netlify in 2025 (Sider.ai)](https://sider.ai/blog/ai-tools/vercel-vs-netlify-in-2025-which-frontend-cloud-fits-your-stack)
- [Vercel AI SDK Documentation](https://ai-sdk.dev/docs/introduction)
- npm view for `ai@6.0.85` (verified via CLI, 2026-02-13)

**Cosine Similarity Libraries:**
- [compute-cosine-similarity (npm)](https://www.npmjs.com/package/compute-cosine-similarity)
- [GitHub: compute-cosine-similarity](https://github.com/compute-io/cosine-similarity)

**Vector Databases vs In-Memory (Decision Rationale):**
- [You Probably Don't Need a Vector Database for Your RAG — Yet (Towards Data Science)](https://towardsdatascience.com/you-probably-dont-need-a-vector-database-for-your-rag-yet/)
- [Vector Databases vs. In-Memory Databases (Zilliz)](https://zilliz.com/blog/vector-database-vs-in-memory-databases)

---
*Stack research for: WWTS (What Would Taylor Say?) — OpenAI-powered lyric matching*
*Researched: 2026-02-13*
*Confidence: HIGH (versions verified via npm CLI; architecture patterns verified via official docs and 2025/2026 sources)*
