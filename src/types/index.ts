export type { ContactFormData } from "./contact";

export const SECURITY_CONSTANTS = {
  CSRF_TOKEN_EXPIRY: 60 * 60 * 1_000,
  CSRF_REFRESH_THRESHOLD: 5 * 60 * 1_000,
} as const;

export interface CSRFTokenResponse {
  readonly success: boolean;
  readonly token: string;
  readonly sessionId: string;
  readonly expires: number;
  readonly expiresIn: number;
}

export interface RateLimitConfig {
  readonly name: string;
  readonly windowMs: number;
  readonly maxRequests: number;
  readonly failureMode: "closed" | "memory";
}

export interface RateLimitResult {
  readonly allowed: boolean;
  readonly resetTime?: number;
  readonly remainingRequests?: number;
  readonly backend?: "redis" | "memory" | "unavailable";
  readonly degraded?: boolean;
  readonly reason?: "limit_exceeded" | "dependency_unavailable";
}

export interface SecurityEvent {
  readonly type:
    | "rate_limit"
    | "csrf_violation"
    | "origin_violation"
    | "security_success";
  readonly ip: string;
  readonly timestamp: string;
  readonly details?: Record<string, unknown>;
  readonly severity: "low" | "medium" | "high" | "critical";
}
