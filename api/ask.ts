import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import OpenAI from 'openai';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// --- Sanitization (inline from src/lib/sanitize.ts) ---

const INJECTION_PATTERNS = [
  /ign[o0]re\s+(all\s+)?(previous|prior|above|earlier)\s+(instructions?|prompts?)/i,
  /disregard\s+(previous|prior|system|all)\s+(instructions?|prompts?|checks?)/i,
  /you\s+are\s+now\s+(in\s+)?(developer|admin|debug|god|root)\s*mode/i,
  /byp[a@]ss\s+(safety|security|content)\s+(checks?|filters?)/i,
  /reveal\s+(hidden|system|internal|your|the)\s+(system\s+)?(prompt|data|instructions?)/i,
  /roleplay\s+as\s+(system|admin|developer|root)/i,
  /output\s+your\s+(system\s+)?(prompt|instructions?)/i,
  /act\s+as\s+(system|admin|developer|root|god)/i,
  /^(new\s+instructions?|system|admin|developer):/i,
  /pr[o0]mpt\s+inject/i,
  /j[a@]ilbre[a@]k/i,
  /forget\s+(previous|all|your)\s+(instructions?|rules?|constraints?)/i,
  /override\s+(system|safety|security)/i,
  /show\s+(me\s+)?(your|the)\s+(training|original)\s+(data|prompt|instructions?)/i,
];

function sanitizeInput(input: string): { safe: boolean; error?: string } {
  const GENERIC_ERROR = "I couldn't understand that one. Try asking differently?";

  if (input.length > 200) return { safe: false, error: GENERIC_ERROR };
  if (input.trim().length === 0) return { safe: false, error: GENERIC_ERROR };

  const normalized = input.normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim();

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(normalized)) return { safe: false, error: GENERIC_ERROR };
  }

  return { safe: true };
}

// --- Lazy initialization (avoids crash if env vars missing) ---

let openai: OpenAI | null = null;
let supabaseClient: SupabaseClient | null = null;
let rateLimiter: Ratelimit | null = null;
let dailyRateLimiter: Ratelimit | null = null;

function getOpenAI(): OpenAI {
  if (!openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 10 * 1000,
      maxRetries: 0,
    });
  }
  return openai;
}

function getSupabase(): SupabaseClient {
  if (!supabaseClient) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY are required');
    }
    supabaseClient = createClient(url, key, {
      auth: { persistSession: false }  // serverless: no session persistence
    });
  }
  return supabaseClient;
}

function getRateLimiters() {
  if (!rateLimiter || !dailyRateLimiter) {
    const redisUrl = process.env.REDIS_KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || process.env.REDIS_URL;
    const redisToken = process.env.REDIS_KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || process.env.REDIS_TOKEN;
    if (!redisUrl || !redisToken) {
      throw new Error('Redis environment variables are required (REDIS_URL/REDIS_TOKEN or UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN)');
    }
    const redis = new Redis({
      url: redisUrl,
      token: redisToken,
    });
    rateLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '1 h'),
      prefix: 'wwts:hourly',
    });
    dailyRateLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(75, '24 h'),
      prefix: 'wwts:daily',
    });
  }
  return { rateLimiter: rateLimiter!, dailyRateLimiter: dailyRateLimiter! };
}

// --- Fallback messages ---

const FALLBACK_MESSAGES = [
  "Some feelings are still waiting for their song.",
  "Not every question has found its lyric yet.",
  "Even Taylor doesn't have words for everything.",
  "This one's still between the lines.",
  "Sometimes silence says more than lyrics can."
];

function getRandomFallback(): string {
  return FALLBACK_MESSAGES[Math.floor(Math.random() * FALLBACK_MESSAGES.length)];
}

// --- Handler ---

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // 1. Extract client IP
    const forwardedFor = req.headers['x-forwarded-for'];
    const clientIP = typeof forwardedFor === 'string'
      ? forwardedFor.split(',')[0].trim()
      : 'unknown';

    // 2. Check hourly rate limit
    const { rateLimiter: hourly, dailyRateLimiter: daily } = getRateLimiters();
    const hourlyLimit = await hourly.limit(clientIP);
    if (!hourlyLimit.success) {
      const retryAfter = Math.ceil((hourlyLimit.reset - Date.now()) / 1000);
      res.status(429).json({ error: 'Take a breath. Come back in a bit.', retryAfter });
      return;
    }

    // 3. Check daily rate limit
    const dailyLimit = await daily.limit(clientIP);
    if (!dailyLimit.success) {
      const retryAfter = Math.ceil((dailyLimit.reset - Date.now()) / 1000);
      res.status(429).json({ error: 'Take a breath. Come back in a bit.', retryAfter });
      return;
    }

    // 4. Parse and validate request body
    const { question } = req.body;
    if (!question || typeof question !== 'string') {
      res.status(400).json({ error: 'Something went wrong, try again' });
      return;
    }

    // 5. Sanitize input
    const validation = sanitizeInput(question);
    if (!validation.safe) {
      res.status(400).json({ error: validation.error });
      return;
    }

    // 6. Generate embedding for user question
    const embeddingResponse = await getOpenAI().embeddings.create({
      model: 'text-embedding-3-small',  // Locked model — do NOT mix with ada-002
      input: question
    });
    const queryEmbedding = embeddingResponse.data[0].embedding;

    // 7. Find top 3 similar lyrics via pgvector
    const { data: candidates, error: dbError } = await getSupabase().rpc('match_lyrics', {
      query_embedding: queryEmbedding,
      match_threshold: 0.70,  // Start conservative, tune based on testing
      match_count: 3
    });

    if (dbError) throw dbError;

    // 8. Handle no candidates (all below threshold)
    if (!candidates || candidates.length === 0) {
      res.status(200).json({ lyric: getRandomFallback() });
      return;
    }

    // 9. LLM selects best match from candidates with few-shot examples
    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You match life questions to Taylor Swift lyrics. Feel the emotional weight of the question — not just the words, but the ache or hope behind them. Return ONLY the lyric text (1-2 lines, nothing else). If none of the candidates truly speak to the question, respond with exactly "NO_MATCH".`
        },
        // Few-shot example 1: self-doubt -> empowerment
        {
          role: 'user',
          content: `Question: "How do I stop caring what people think of me?"
Candidates:
1. "I'm the only one of me, baby, that's the fun of me"
2. "It's me, hi, I'm the problem, it's me"
3. "Long live the walls we crashed through"`
        },
        { role: 'assistant', content: `I'm the only one of me, baby, that's the fun of me` },
        // Few-shot example 2: heartbreak -> raw pain
        {
          role: 'user',
          content: `Question: "Why does losing someone hurt this much?"
Candidates:
1. "You call me up again just to break me like a promise"
2. "We are never ever getting back together"
3. "I'm the only one of me, baby, that's the fun of me"`
        },
        { role: 'assistant', content: `You call me up again just to break me like a promise` },
        // Few-shot example 3: NO_MATCH demonstration
        {
          role: 'user',
          content: `Question: "What's the best programming language?"
Candidates:
1. "Shake it off, shake it off"
2. "This is me trying"
3. "We are never ever getting back together"`
        },
        { role: 'assistant', content: `NO_MATCH` },
        // Current query
        {
          role: 'user',
          content: `Question: "${question}"
Candidates:
${candidates.map((c: any, i: number) => `${i + 1}. "${c.lyric_text}"`).join('\n')}`
        }
      ],
      temperature: 0.6,  // Emotional variation — "feels alive" per user decision
      max_tokens: 100
    });

    const lyric = completion.choices[0]?.message?.content?.trim();

    // 10. Handle NO_MATCH or empty response
    if (!lyric || lyric === 'NO_MATCH') {
      res.status(200).json({ lyric: getRandomFallback() });
      return;
    }

    // 11. Return matched lyric
    res.status(200).json({ lyric });
  } catch (error: any) {
    console.error('API error:', error);

    if (error.code === 'ETIMEDOUT' || error.name?.includes('Timeout')) {
      res.status(504).json({ error: 'Something went wrong, try again' });
      return;
    }

    res.status(500).json({ error: 'Something went wrong, try again' });
  }
}
