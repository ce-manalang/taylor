/**
 * Vercel serverless function that handles lyric requests.
 * This is the secure API proxy that protects the OpenAI API key from client exposure.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Serverless function handler for /api/ask endpoint.
 * Accepts { question: string } and returns { lyric: string } or error response.
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Dynamically import dependencies to avoid module initialization errors
    const { openai } = await import('../src/lib/openai');
    const { rateLimiter, dailyRateLimiter } = await import(
      '../src/lib/ratelimit'
    );
    const { sanitizeInput } = await import('../src/lib/sanitize');

    // 1. Extract client IP from x-forwarded-for header
    const forwardedFor = req.headers['x-forwarded-for'];
    const clientIP =
      typeof forwardedFor === 'string'
        ? forwardedFor.split(',')[0].trim()
        : 'unknown';

    // 2. Check hourly rate limit (5 requests per hour)
    const hourlyLimit = await rateLimiter.limit(clientIP);
    if (!hourlyLimit.success) {
      const retryAfter = Math.ceil((hourlyLimit.reset - Date.now()) / 1000);
      return res.status(429).json({
        error: 'Take a breath. Come back in a bit.',
        retryAfter,
      });
    }

    // 3. Check daily rate limit (75 requests per 24 hours)
    const dailyLimit = await dailyRateLimiter.limit(clientIP);
    if (!dailyLimit.success) {
      const retryAfter = Math.ceil((dailyLimit.reset - Date.now()) / 1000);
      return res.status(429).json({
        error: 'Take a breath. Come back in a bit.',
        retryAfter,
      });
    }

    // 4. Parse and validate request body
    const { question } = req.body;

    // Validate question field
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Something went wrong, try again' });
    }

    // 5. Sanitize input
    const validation = sanitizeInput(question);
    if (!validation.safe) {
      return res.status(400).json({ error: validation.error });
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
      return res.status(500).json({ error: 'Something went wrong, try again' });
    }

    // 7. Return success
    return res.status(200).json({ lyric });
  } catch (error: any) {
    // Log error for debugging (visible in Vercel logs)
    console.error('API error:', error);

    // Provide specific error messages for configuration issues
    if (error.message?.includes('OPENAI_API_KEY')) {
      console.error(
        'Environment variable OPENAI_API_KEY is not configured in Vercel'
      );
      return res
        .status(500)
        .json({ error: 'Something went wrong, try again' });
    }

    if (
      error.message?.includes('REDIS_URL') ||
      error.message?.includes('REDIS_TOKEN')
    ) {
      console.error(
        'Environment variables REDIS_URL or REDIS_TOKEN are not configured in Vercel'
      );
      return res
        .status(500)
        .json({ error: 'Something went wrong, try again' });
    }

    // Check for timeout errors
    if (error.code === 'ETIMEDOUT' || error.name?.includes('Timeout')) {
      return res.status(504).json({ error: 'Something went wrong, try again' });
    }

    // All other errors
    return res.status(500).json({ error: 'Something went wrong, try again' });
  }
}
