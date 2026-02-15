/**
 * Mock API for local development.
 * Returns realistic response shapes without real API calls.
 */

const MOCK_LYRICS = [
  "Long story short, I survived",
  "It's me, hi, I'm the problem, it's me",
  "I'm the only one of me, baby, that's the fun of me",
  "This is me trying",
  "Shake it off, shake it off"
];

const FALLBACK_MESSAGES = [
  "Some feelings are still waiting for their song.",
  "Not every question has found its lyric yet.",
  "Even Taylor doesn't have words for everything.",
  "This one's still between the lines.",
  "Sometimes silence says more than lyrics can."
];

export async function mockAskAPI(
  question: string
): Promise<{ lyric?: string; error?: string }> {
  // Simulate realistic network delay (800-1200ms)
  await new Promise((resolve) =>
    setTimeout(resolve, 800 + Math.random() * 400)
  );

  // Validate empty input
  if (question.trim().length === 0) {
    return { error: "I couldn't understand that one. Try asking differently?" };
  }

  // Validate length (matches production 200-char limit)
  if (question.length > 200) {
    return { error: "I couldn't understand that one. Try asking differently?" };
  }

  // Simulate fallback for very short questions (< 10 chars)
  if (question.trim().length < 10) {
    const randomFallback = FALLBACK_MESSAGES[Math.floor(Math.random() * FALLBACK_MESSAGES.length)];
    return { lyric: randomFallback };
  }

  // Return random lyric from pool (simulates temperature > 0 behavior)
  const randomLyric = MOCK_LYRICS[Math.floor(Math.random() * MOCK_LYRICS.length)];
  return { lyric: randomLyric };
}
