/**
 * OpenAI client configuration for the backend API.
 * This module is server-only and should never be imported by frontend code.
 */

import OpenAI from 'openai';

// Validate environment variable at module initialization
if (!process.env.OPENAI_API_KEY) {
  throw new Error(
    'OPENAI_API_KEY environment variable is required. Get your key at https://platform.openai.com/api-keys'
  );
}

// Create OpenAI client with locked configuration
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 10 * 1000, // 10 seconds - locked decision from CONTEXT.md
  maxRetries: 0, // Disable retries for predictable serverless behavior
});
