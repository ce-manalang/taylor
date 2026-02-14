import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import OpenAI from 'openai';

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

function getRateLimiters() {
  if (!rateLimiter || !dailyRateLimiter) {
    const redisUrl = process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
    const redisToken = process.env.REDIS_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
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

    // 6. Call OpenAI API
    const client = getOpenAI();
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are helping match a life question to a Taylor Swift lyric. Return only the lyric text, nothing else.',
        },
        { role: 'user', content: question },
      ],
      max_tokens: 150,
    });

    const lyric = completion.choices[0]?.message?.content;
    if (!lyric) {
      res.status(500).json({ error: 'Something went wrong, try again' });
      return;
    }

    // 7. Return success
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
