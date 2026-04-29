/**
 * Token-bucket rate limiter for API routes.
 * Each key (usually user IP or user ID) gets a fixed number of tokens
 * that refill over time. When tokens run out, requests are rejected.
 */

interface RateLimitEntry {
  tokens: number;
  lastRefill: number;
}

const store = new Map<string, RateLimitEntry>();

export interface RateLimitConfig {
  /** Maximum requests allowed in the window */
  maxRequests: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 10,  // 10 diagnoses per minute per user
  windowMs: 60_000, // 1 minute
};

/**
 * Check if a request from `key` is within rate limits.
 * Returns { allowed, remaining, retryAfterMs }.
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig = DEFAULT_CONFIG
): { allowed: boolean; remaining: number; retryAfterMs: number } {
  const now = Date.now();
  let entry = store.get(key);

  if (!entry) {
    entry = { tokens: config.maxRequests, lastRefill: now };
    store.set(key, entry);
  }

  // Refill tokens based on elapsed time
  const elapsed = now - entry.lastRefill;
  const refillRate = config.maxRequests / config.windowMs; // tokens per ms
  const tokensToAdd = elapsed * refillRate;
  entry.tokens = Math.min(config.maxRequests, entry.tokens + tokensToAdd);
  entry.lastRefill = now;

  if (entry.tokens >= 1) {
    entry.tokens -= 1;
    return { allowed: true, remaining: Math.floor(entry.tokens), retryAfterMs: 0 };
  }

  // Denied — calculate when next token is available
  const msUntilNextToken = (1 - entry.tokens) / refillRate;
  return {
    allowed: false,
    remaining: 0,
    retryAfterMs: Math.ceil(msUntilNextToken),
  };
}

/**
 * Next.js API helper — returns a 429 Response if rate-limited, or null if allowed.
 */
export function rateLimitResponse(
  key: string,
  config?: RateLimitConfig
): Response | null {
  const result = checkRateLimit(key, config);

  if (!result.allowed) {
    return new Response(
      JSON.stringify({
        error: "Too many requests",
        retryAfterMs: result.retryAfterMs,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(Math.ceil(result.retryAfterMs / 1000)),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  return null; // allowed
}
