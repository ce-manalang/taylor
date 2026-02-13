# Architecture Research

**Domain:** LLM-powered text matching/selection with React SPA
**Researched:** 2026-02-13
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                       │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐   ┌──────────┐   ┌──────────┐                 │
│  │  Input   │   │ Loading  │   │  Result  │                 │
│  │  Form    │   │  State   │   │  Display │                 │
│  └────┬─────┘   └────┬─────┘   └────┬─────┘                 │
│       └──────────────┴───────────────┘                       │
├─────────────────────────────────────────────────────────────┤
│                     API Service Layer                        │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────┐            │
│  │         OpenAI API Client/Service            │            │
│  │  - Prompt construction                       │            │
│  │  - Request formatting                        │            │
│  │  - Response parsing                          │            │
│  └──────────────────┬───────────────────────────┘            │
│                     │                                        │
│            [Environment Variable]                            │
│               VITE_OPENAI_KEY                                │
├─────────────────────┴───────────────────────────────────────┤
│                     Data Layer                               │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────┐            │
│  │         Curated Lyrics Dataset               │            │
│  │  - Static TypeScript array/object            │            │
│  │  - Embedded in prompt                        │            │
│  └──────────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────┘
                          ↓
                    [External API]
                    OpenAI API
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| **Input Form** | Captures user question, validates input | React component with controlled input state |
| **Loading State** | Provides feedback during API call | React component with loading indicator |
| **Result Display** | Shows selected lyric response | React component with formatted text output |
| **API Service** | Handles OpenAI communication | TypeScript module with fetch/axios calls |
| **Lyrics Dataset** | Stores curated content | TypeScript const array/object |
| **Prompt Constructor** | Formats question + lyrics for LLM | Function that combines user input + dataset |

## Recommended Project Structure

```
src/
├── components/           # React UI components
│   ├── QuestionInput.tsx # User question input form
│   ├── LyricDisplay.tsx  # Display selected lyric
│   └── LoadingState.tsx  # Loading indicator
├── services/             # Business logic
│   ├── openai.ts        # OpenAI API client
│   └── prompt.ts        # Prompt construction logic
├── data/                 # Static data
│   └── lyrics.ts        # Curated lyrics dataset
├── types/                # TypeScript types
│   └── index.ts         # Shared type definitions
├── App.tsx              # Main app component
└── main.tsx             # Entry point
```

### Structure Rationale

- **components/:** Separates UI concerns, enables component reuse and isolated testing
- **services/:** Isolates external API logic from UI, makes testing and mocking easier
- **data/:** Centralizes curated content, easy to update and version control
- **types/:** Shared TypeScript interfaces ensure type safety across layers

## Architectural Patterns

### Pattern 1: Client-Side Direct API Calls (Simple MVP)

**What:** React frontend makes direct API calls to OpenAI with API key in environment variables

**When to use:** Development/MVP phase, low traffic, single user, rapid prototyping

**Trade-offs:**
- ✅ **Pros:** Zero backend infrastructure, fastest to implement, perfect for MVP
- ✅ **Pros:** No server costs, simple deployment (static hosting)
- ❌ **Cons:** API key exposed in browser (security risk), can't enforce rate limits
- ❌ **Cons:** Can't implement usage monitoring, vulnerable to key theft

**Example:**
```typescript
// src/services/openai.ts
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Required for client-side
});

export async function selectLyric(question: string, lyrics: string[]): Promise<string> {
  const prompt = constructPrompt(question, lyrics);

  const response = await client.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'You are a thoughtful advisor...' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7
  });

  return response.choices[0].message.content || '';
}
```

**For WWTS MVP:** This is the recommended starting pattern given "intentionally minimal architecture" goal.

### Pattern 2: Serverless Backend Proxy (Production)

**What:** API key secured in serverless function (Vercel/Netlify), React calls backend endpoint, backend proxies to OpenAI

**When to use:** Production deployment, public-facing app, when security and monitoring matter

**Trade-offs:**
- ✅ **Pros:** API key never exposed to client, rate limiting possible, usage tracking enabled
- ✅ **Pros:** Can add authentication, moderation, caching layers
- ❌ **Cons:** Requires backend infrastructure (even if serverless), more complex deployment
- ❌ **Cons:** Additional latency from proxy layer

**Example:**
```typescript
// api/select-lyric.ts (Vercel serverless function)
import { OpenAI } from 'openai';

export default async function handler(req, res) {
  const { question } = req.body;

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // Server-side only
  });

  const response = await client.chat.completions.create({...});

  res.status(200).json({ lyric: response.choices[0].message.content });
}

// src/services/api.ts (React client)
export async function selectLyric(question: string): Promise<string> {
  const response = await fetch('/api/select-lyric', {
    method: 'POST',
    body: JSON.stringify({ question }),
    headers: { 'Content-Type': 'application/json' }
  });

  const data = await response.json();
  return data.lyric;
}
```

**For WWTS future:** Migrate to this pattern post-MVP when deploying publicly.

### Pattern 3: Embedded Dataset in Prompt

**What:** Include entire curated lyrics dataset in the system prompt sent to LLM for content-aware selection

**When to use:** Small datasets (<50 items), curated content selection, no vector DB needed

**Trade-offs:**
- ✅ **Pros:** No external database needed, simple to maintain, works well for <100 lyrics
- ✅ **Pros:** LLM has full context for best matching
- ❌ **Cons:** Token cost scales with dataset size, becomes expensive with large datasets
- ❌ **Cons:** Context window limits (~128k tokens for GPT-4)

**Example:**
```typescript
// src/data/lyrics.ts
export const curatedLyrics = [
  { id: 1, text: "This night is sparkling, don't you let it go", theme: "hope" },
  { id: 2, text: "Long story short, I survived", theme: "resilience" },
  // ... more lyrics
];

// src/services/prompt.ts
export function constructPrompt(question: string, lyrics: typeof curatedLyrics): string {
  const lyricsText = lyrics
    .map((l, i) => `${i + 1}. ${l.text}`)
    .join('\n');

  return `
User question: "${question}"

Available responses:
${lyricsText}

Select the SINGLE most appropriate response by number (1-${lyrics.length}).
Consider emotional tone, theme, and relevance.
Return only the exact text of the selected response.
  `;
}
```

**For WWTS:** This is ideal for the "handful of lines, grows over time" requirement.

## Data Flow

### Request Flow

```
[User types question]
        ↓
[QuestionInput component captures state]
        ↓
[Submit button clicked]
        ↓
[App.tsx calls API service]
        ↓
[Prompt constructor combines question + lyrics dataset]
        ↓
[OpenAI service sends formatted prompt]
        ↓
[OpenAI API processes and returns selection]
        ↓
[Response parsed and validated]
        ↓
[LyricDisplay component shows result]
```

### State Management Flow

```
[App.tsx]
   ↓ (useState)
[question: string]        [loading: boolean]      [result: string | null]
   ↓                            ↓                        ↓
[QuestionInput]           [LoadingState]           [LyricDisplay]
```

### Key Data Flows

1. **Question Capture Flow:** User types → React controlled input updates state → validation on submit → triggers API call
2. **API Request Flow:** Question + lyrics combined → formatted as prompt → sent to OpenAI → streamed response (optional) → parsed result
3. **Response Display Flow:** API result → React state updated → Result component re-renders → User sees selected lyric

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-100 users | Client-side API calls acceptable, static lyrics array, no caching needed |
| 100-10k users | Add serverless backend proxy for key security, implement basic rate limiting, add error handling |
| 10k-100k users | Add Redis caching for common questions, implement request queuing, monitor API costs closely |
| 100k+ users | Consider vector DB for lyrics matching, implement semantic caching, add CDN for static assets, potentially switch to self-hosted LLM |

### Scaling Priorities

1. **First bottleneck:** API cost/rate limits — Solution: Implement response caching (common questions), add rate limiting per user, consider cheaper models for simple queries
2. **Second bottleneck:** Dataset size limits — Solution: Migrate from embedded prompt to vector DB (Pinecone/Supabase), use semantic search instead of sending all lyrics

**For WWTS:** MVP doesn't need to worry about scale. Start simple, add complexity only when needed.

## Anti-Patterns

### Anti-Pattern 1: Complex State Management Too Early

**What people do:** Add Redux/Zustand/Context for global state management in MVP
**Why it's wrong:** Over-engineering for a simple question → answer flow, adds complexity without benefit
**Do this instead:** Use React's built-in useState and prop drilling for MVP. Only add global state if you have 3+ components needing shared state.

### Anti-Pattern 2: Streaming Without Purpose

**What people do:** Implement token streaming for perceived "better UX"
**Why it's wrong:** WWTS shows a single lyric (short text), not a multi-paragraph essay. Streaming adds complexity for <50 tokens of output.
**Do this instead:** Use simple await/response pattern. Show loading state. Display complete lyric instantly. Streaming is overkill here.

### Anti-Pattern 3: Over-Structured Prompt Engineering

**What people do:** Spend MVP time on complex multi-shot prompts, JSON schemas, tool calling
**Why it's wrong:** The task is simple: "pick best lyric from list." LLMs are very good at this with basic prompting.
**Do this instead:** Start with straightforward prompt: question + numbered list + instruction. Iterate only if results are poor.

### Anti-Pattern 4: Premature Vector Database

**What people do:** Implement Pinecone/embedding search before testing simple approach
**Why it's wrong:** Vector DBs add infrastructure, cost, and complexity. For <100 lyrics, LLMs can process entire dataset in prompt context.
**Do this instead:** Embed all lyrics in prompt until you hit 50+ lyrics or cost becomes issue. Then evaluate vector DB.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| **OpenAI API** | Direct HTTP fetch with API key | Use official `openai` npm package (34.3 kB gzipped) |
| **Vercel/Netlify** | Deploy as static site, optional serverless functions | Environment variables for API key management |
| **Vite** | Environment variable access via `import.meta.env` | Prefix with `VITE_` for client-side exposure |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| **UI ↔ API Service** | Function calls returning Promises | Keep API logic separate from components for testability |
| **API Service ↔ Data** | Import static array | Lyrics dataset imported by prompt constructor |
| **Components ↔ App** | Props and callbacks | Parent (App) manages state, children receive via props |

## Implementation Sequence (Build Order)

Based on architectural dependencies, recommended build order:

### Phase 1: Data Foundation
1. **Create lyrics dataset** (`src/data/lyrics.ts`)
   - Start with 5-10 curated lyrics
   - Define TypeScript interface
   - Export as const array

### Phase 2: API Integration
2. **Install OpenAI SDK** (`npm install openai`)
3. **Create prompt constructor** (`src/services/prompt.ts`)
   - Function to combine question + lyrics
   - Simple, testable, no API calls
4. **Create OpenAI service** (`src/services/openai.ts`)
   - API client initialization
   - Main selection function
   - Error handling

### Phase 3: UI Components
5. **Build QuestionInput component**
   - Text input with validation
   - Submit button
   - Callback to parent
6. **Build LoadingState component**
   - Simple loading indicator
7. **Build LyricDisplay component**
   - Formatted text display
   - Empty state handling

### Phase 4: Integration
8. **Wire up App.tsx**
   - State management (question, loading, result)
   - Event handlers
   - Connect components
9. **Environment setup**
   - Create `.env` file
   - Add `VITE_OPENAI_API_KEY`
   - Update `.gitignore`

### Phase 5: Polish
10. **Error handling**
    - API errors
    - Network failures
    - Empty responses
11. **Basic styling**
    - Consistent spacing
    - Readable typography
    - Responsive layout

**Why this order:**
- Data first (no dependencies)
- Services second (depend on data)
- UI third (depends on services)
- Integration fourth (depends on all pieces)
- Polish last (depends on working system)

Each phase is independently testable and produces a working artifact.

## Technology Decisions

### OpenAI SDK vs Vercel AI SDK

**Recommendation:** Use OpenAI SDK for MVP

**Rationale:**
- **OpenAI SDK:** 34.3 kB bundle, 8.8M weekly downloads, direct API access, perfect for simple use cases
- **Vercel AI SDK:** Better for streaming, multi-provider support, React hooks (useChat, useCompletion)
- **WWTS needs:** Single non-streaming API call, only OpenAI, minimal bundle size
- **Decision:** Start with OpenAI SDK. Switch to Vercel AI SDK only if adding streaming or multiple providers.

### State Management

**Recommendation:** React useState (built-in)

**Rationale:**
- Only 3 pieces of state: question (string), loading (boolean), result (string | null)
- No shared state across distant components
- No complex updates or middleware needed
- **Decision:** useState in App.tsx, pass via props. Zero additional dependencies.

### Environment Variables

**Recommendation:** Vite's built-in env support

**Rationale:**
- Vite includes `.env` support out of the box
- Variables prefixed with `VITE_` exposed to client
- Accessed via `import.meta.env.VITE_*`
- **Decision:** Use `.env` file with `VITE_OPENAI_API_KEY`. Add `.env` to `.gitignore`.

## Security Considerations

### For MVP (Client-Side API Key)

**Acceptable Risks:**
- API key visible in browser developer tools
- Anyone can extract and use the key
- No rate limiting or cost controls

**Mitigation:**
- Use API key with low spending limit ($5-10/month)
- Monitor usage daily via OpenAI dashboard
- Rotate key if abuse detected
- Document this as "development only" approach

### For Production (Required)

**Must implement:**
1. **Backend proxy** — Serverless function (Vercel/Netlify) holds real API key
2. **Rate limiting** — Max requests per IP/session (e.g., 10/hour)
3. **Request validation** — Sanitize user input, reject malicious content
4. **Cost monitoring** — Alert when usage exceeds threshold
5. **Key rotation** — Periodic API key updates

**Timeline:** Migrate to backend proxy before public announcement or when usage exceeds $20/month.

## Sources

- [Building AI-Powered Apps in 2026: Integrating OpenAI and Claude APIs with React and Node](https://www.nucamp.co/blog/building-ai-powered-apps-in-2026-integrating-openai-and-claude-apis-with-react-and-node)
- [The React + AI Stack for 2026](https://www.builder.io/blog/react-ai-stack-2026)
- [Integrating AI APIs into React Apps | 2026 Guide](https://www.credosystemz.com/blog/integrating-ai-apis-into-react-app/)
- [LangChain vs Vercel AI SDK vs OpenAI SDK: 2026 Guide](https://strapi.io/blog/langchain-vs-vercel-ai-sdk-vs-openai-sdk-comparison-guide)
- [Best Practices for API Key Safety | OpenAI Help Center](https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety)
- [Leveraging Vite's Environment Variables for Secure API Key Management](https://medium.com/@bhaskarkumar.india/leveraging-vites-environment-variables-for-secure-api-key-management-dd533849a5b8)
- [AI UI Patterns](https://www.patterns.dev/react/ai-ui-patterns/)
- [MCP Magic Moments: A Guide to LLM Patterns](https://www.elasticpath.com/mcp-magic-moments-guide-to-llm-patterns)

---
*Architecture research for: WWTS (What Would Taylor Say?) — LLM-powered lyric matching*
*Researched: 2026-02-13*
