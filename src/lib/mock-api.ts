/**
 * Mock API for local development.
 * Returns realistic response shapes without real API calls.
 */

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

  // Return hardcoded lyric for valid inputs
  // "Long story short, I survived" - from evermore
  return { lyric: 'Long story short, I survived' };
}
