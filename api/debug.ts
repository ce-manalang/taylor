import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';
import OpenAI from 'openai';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const results: Record<string, any> = {
    envVars: {
      OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
      REDIS_URL: !!process.env.REDIS_URL,
      REDIS_TOKEN: !!process.env.REDIS_TOKEN,
    },
  };

  // Test Redis connection
  try {
    const redis = new Redis({
      url: process.env.REDIS_URL!,
      token: process.env.REDIS_TOKEN!,
    });
    await redis.ping();
    results.redis = 'connected';
  } catch (e: any) {
    results.redis = `error: ${e.message}`;
  }

  // Test OpenAI connection
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
      timeout: 10000,
      maxRetries: 0,
    });
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Say hello' }],
      max_tokens: 5,
    });
    results.openai = `connected: ${completion.choices[0]?.message?.content}`;
  } catch (e: any) {
    results.openai = `error: ${e.message}`;
  }

  res.status(200).json(results);
}
