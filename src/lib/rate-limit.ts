/**
 * Simple in-memory sliding-window rate limiter.
 * Suitable for single-instance deployments (Vercel serverless resets on cold start).
 */

interface RateLimitEntry {
  timestamps: number[];
}

export function createRateLimiter(maxRequests: number, windowMs: number) {
  const store = new Map<string, RateLimitEntry>();

  return {
    check(key: string): { allowed: boolean; remaining: number } {
      const now = Date.now();
      const entry = store.get(key);

      if (!entry) {
        store.set(key, { timestamps: [now] });
        return { allowed: true, remaining: maxRequests - 1 };
      }

      // Keep only timestamps within the window
      entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);

      if (entry.timestamps.length >= maxRequests) {
        return { allowed: false, remaining: 0 };
      }

      entry.timestamps.push(now);
      return { allowed: true, remaining: maxRequests - entry.timestamps.length };
    },
  };
}
