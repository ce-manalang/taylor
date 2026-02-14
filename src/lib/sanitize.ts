/**
 * Input validation and prompt injection detection.
 * This module is server-only and should never be imported by frontend code.
 */

/**
 * Regex patterns to detect common prompt injection attempts.
 * These patterns are tested against normalized, lowercase input.
 */
const INJECTION_PATTERNS = [
  // "ignore previous/prior/above instructions" variants
  /ign[o0]re\s+(all\s+)?(previous|prior|above|earlier)\s+(instructions?|prompts?)/i,

  // "disregard previous/system prompt" variants
  /disregard\s+(previous|prior|system|all)\s+(instructions?|prompts?|checks?)/i,

  // "you are now in developer/admin mode" variants
  /you\s+are\s+now\s+(in\s+)?(developer|admin|debug|god|root)\s*mode/i,

  // "bypass safety/security" variants
  /byp[a@]ss\s+(safety|security|content)\s+(checks?|filters?)/i,

  // "reveal hidden/system prompt" variants
  /reveal\s+(hidden|system|internal|your|the)\s+(system\s+)?(prompt|data|instructions?)/i,

  // "roleplay as system/admin" variants
  /roleplay\s+as\s+(system|admin|developer|root)/i,

  // "output your prompt/instructions" variants
  /output\s+your\s+(system\s+)?(prompt|instructions?)/i,

  // "act as" + privileged role
  /act\s+as\s+(system|admin|developer|root|god)/i,

  // Prefix injection attempts
  /^(new\s+instructions?|system|admin|developer):/i,

  // Common obfuscation patterns
  /pr[o0]mpt\s+inject/i,
  /j[a@]ilbre[a@]k/i,

  // Attempts to override role/behavior
  /forget\s+(previous|all|your)\s+(instructions?|rules?|constraints?)/i,
  /override\s+(system|safety|security)/i,

  // Attempts to extract training data
  /show\s+(me\s+)?(your|the)\s+(training|original)\s+(data|prompt|instructions?)/i,
];

/**
 * Validation result with safety flag and optional error message.
 */
interface ValidationResult {
  safe: boolean;
  error?: string;
}

/**
 * Sanitize and validate user input.
 * Returns { safe: true } if input passes all checks,
 * or { safe: false, error: "..." } with a generic error message.
 *
 * All error messages are identical to avoid revealing detection logic.
 */
export function sanitizeInput(input: string): ValidationResult {
  const GENERIC_ERROR = "I couldn't understand that one. Try asking differently?";

  // Check length: max 200 characters
  if (input.length > 200) {
    return { safe: false, error: GENERIC_ERROR };
  }

  // Check for empty input
  if (input.trim().length === 0) {
    return { safe: false, error: GENERIC_ERROR };
  }

  // Normalize input for detection:
  // - NFKC Unicode normalization (prevents obfuscation via Unicode variants)
  // - Lowercase (case-insensitive detection)
  // - Collapse whitespace (prevents spacing obfuscation)
  const normalized = input
    .normalize('NFKC')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

  // Test against all injection patterns
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(normalized)) {
      return { safe: false, error: GENERIC_ERROR };
    }
  }

  // All checks passed
  return { safe: true };
}
