import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const envCheck = {
    OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
    REDIS_URL: !!process.env.REDIS_URL,
    REDIS_TOKEN: !!process.env.REDIS_TOKEN,
    UPSTASH_REDIS_REST_URL: !!process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: !!process.env.UPSTASH_REDIS_REST_TOKEN,
    KV_REST_API_URL: !!process.env.KV_REST_API_URL,
    KV_REST_API_TOKEN: !!process.env.KV_REST_API_TOKEN,
    KV_URL: !!process.env.KV_URL,
    nodeVersion: process.version,
  };
  res.status(200).json(envCheck);
}
