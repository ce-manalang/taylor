/**
 * Shared API types for the /api/ask endpoint.
 * These types are used by both the frontend and backend.
 */

export interface AskRequest {
  question: string;
}

export interface AskResponse {
  lyric: string;
}

export interface AskErrorResponse {
  error: string;
  retryAfter?: number; // seconds until rate limit reset
}
