/**
 * Rate limiting configuration using Upstash Redis.
 * This module is server-only and should never be imported by frontend code.
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Validate environment variables at module initialization
if (!process.env.REDIS_URL || !process.env.REDIS_TOKEN) {
  throw new Error(
    'REDIS_URL and REDIS_TOKEN environment variables are required. Create a free instance at https://console.upstash.com'
  );
}

// Create Redis client
const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
});

// Hourly rate limiter: 5 requests per hour
// Allows 1 question + 4 retries/variations per hour
export const rateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 h'),
  prefix: 'wwts:hourly',
  analytics: true,
});

// Daily rate limiter: 75 requests per 24 hours
// Midpoint of 50-100 range - generous for real users, tight enough to block automation
export const dailyRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(75, '24 h'),
  prefix: 'wwts:daily',
  analytics: true,
});
