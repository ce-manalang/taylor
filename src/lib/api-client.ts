/**
 * Frontend API client for lyric requests.
 * Automatically switches between mock (development) and real API (production).
 */

import type { AskRequest, AskResponse, AskErrorResponse } from '../types/api';
import { mockAskAPI } from './mock-api';

/**
 * Ask a question and get a Taylor Swift lyric response.
 * In development, uses mock API. In production, calls /api/ask endpoint.
 */
export async function askQuestion(
  question: string
): Promise<{ lyric?: string; error?: string }> {
  // Development: use mock API
  if (import.meta.env.DEV) {
    return mockAskAPI(question);
  }

  // Production: call real API endpoint
  try {
    const response = await fetch('/api/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question } as AskRequest),
    });

    const data: AskResponse | AskErrorResponse = await response.json();

    // Return lyric on success
    if ('lyric' in data) {
      return { lyric: data.lyric };
    }

    // Return error from API
    if ('error' in data) {
      return { error: data.error };
    }

    // Unexpected response shape
    return { error: 'Something went wrong, try again' };
  } catch (error) {
    // Network error or fetch failure
    console.error('API client error:', error);
    return { error: 'Something went wrong, try again' };
  }
}
