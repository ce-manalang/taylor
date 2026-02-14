/**
 * Vercel serverless function that handles lyric requests.
 * This is the secure API proxy that protects the OpenAI API key from client exposure.
 */

import { openai } from '../src/lib/openai';
import { rateLimiter, dailyRateLimiter } from '../src/lib/ratelimit';
import { sanitizeInput } from '../src/lib/sanitize';

/**
 * POST handler for /api/ask endpoint.
 * Accepts { question: string } and returns { lyric: string } or error response.
 */
export async function POST(request: Request): Promise<Response> {
  try {
    // 1. Extract client IP from x-forwarded-for header
    const forwardedFor = request.headers.get('x-forwarded-for');
    const clientIP = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';

    // 2. Check hourly rate limit (5 requests per hour)
    const hourlyLimit = await rateLimiter.limit(clientIP);
    if (!hourlyLimit.success) {
      const retryAfter = Math.ceil((hourlyLimit.reset - Date.now()) / 1000);
      return new Response(
        JSON.stringify({
          error: 'Take a breath. Come back in a bit.',
          retryAfter,
        }),
        {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 3. Check daily rate limit (75 requests per 24 hours)
    const dailyLimit = await dailyRateLimiter.limit(clientIP);
    if (!dailyLimit.success) {
      const retryAfter = Math.ceil((dailyLimit.reset - Date.now()) / 1000);
      return new Response(
        JSON.stringify({
          error: 'Take a breath. Come back in a bit.',
          retryAfter,
        }),
        {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 4. Parse request body
    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Something went wrong, try again' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const { question } = body;

    // Validate question field
    if (!question || typeof question !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Something went wrong, try again' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 5. Sanitize input
    const validation = sanitizeInput(question);
    if (!validation.safe) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 6. Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are helping match a life question to a Taylor Swift lyric. Return only the lyric text, nothing else.',
        },
        { role: 'user', content: question },
      ],
      max_tokens: 150,
    });

    const lyric = completion.choices[0]?.message?.content;

    // Validate OpenAI response
    if (!lyric) {
      return new Response(
        JSON.stringify({ error: 'Something went wrong, try again' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 7. Return success
    return new Response(JSON.stringify({ lyric }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    // Log error for debugging
    console.error('API error:', error);

    // Check for timeout errors
    if (error.code === 'ETIMEDOUT' || error.name?.includes('Timeout')) {
      return new Response(
        JSON.stringify({ error: 'Something went wrong, try again' }),
        {
          status: 504,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // All other errors
    return new Response(
      JSON.stringify({ error: 'Something went wrong, try again' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
