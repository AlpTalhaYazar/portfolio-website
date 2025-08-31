// =================================================
// CORE DOMAIN TYPES
// =================================================

export interface Experience {
  readonly id: string;
  readonly company: string;
  readonly position: string;
  readonly period: string;
  readonly location: string;
  readonly description: string;
  readonly achievements: readonly string[];
  readonly technologies: readonly string[];
  readonly type: "current" | "previous";
}

export interface Project {
  readonly id: string;
  readonly name: string;
  readonly type: "B2B" | "B2G";
  readonly description: string;
  readonly technologies: readonly string[];
  readonly features: readonly string[];
  readonly role: string;
  readonly company: string;
  readonly status: "active" | "completed";
}

export interface Skill {
  readonly name: string;
  readonly category:
    | "backend"
    | "frontend"
    | "database"
    | "tools"
    | "languages";
  readonly proficiency: "expert" | "proficient" | "intermediate" | "basic";
  readonly icon?: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot?: string;
  csrfToken?: string;
}

export interface SocialLink {
  readonly name: string;
  readonly url: string;
  readonly icon: string;
}

// =================================================
// THEME SYSTEM TYPES
// =================================================

export type Theme = "light" | "dark" | "matrix" | "starwars" | "system";
export type EffectiveTheme = "light" | "dark" | "matrix" | "starwars";

export interface ThemeContextValue {
  readonly theme: Theme;
  readonly effectiveTheme: EffectiveTheme;
  readonly setTheme: (theme: Theme) => void;
}

// =================================================
// COMPONENT PROP TYPES
// =================================================

export interface BaseComponentProps {
  readonly className?: string;
  readonly children?: React.ReactNode;
}

export interface AnimationProps {
  readonly animate?: boolean;
  readonly delay?: number;
  readonly duration?: number;
}

export interface AccessibilityProps {
  readonly ariaLabel?: string;
  readonly ariaDescribedBy?: string;
  readonly role?: string;
  readonly tabIndex?: number;
}

// =================================================
// PERFORMANCE & UTILITY TYPES
// =================================================

export interface PerformancePreferences {
  readonly reducedMotion: boolean;
  readonly isLowEndDevice: boolean;
  readonly frameRate: number;
  readonly shouldAnimate: boolean;
  readonly animationQuality: "none" | "low" | "high";
  readonly particleCount: number;
}

export interface SecurityConfig {
  readonly isDevelopment: boolean;
  readonly isProduction: boolean;
  readonly allowDevTools: boolean;
  readonly maxFileSize: number;
  readonly allowedFileTypes: readonly string[];
  readonly maxFormSubmissions: number;
  readonly rateLimitWindow: number;
}

// =================================================
// SECURITY-SPECIFIC TYPES
// =================================================

// Security Configuration Constants
export const SECURITY_CONSTANTS = {
  // CSRF Token Management
  CSRF_TOKEN_EXPIRY: 60 * 60 * 1000, // 1 hour
  CSRF_REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes before expiry

  // Rate Limiting
  DEFAULT_RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  DEFAULT_MAX_REQUESTS: 5,

  // Progressive Blocking Durations (gradual escalation)
  BLOCK_DURATIONS: {
    LEVEL_1: 5 * 60 * 1000, // 5 minutes
    LEVEL_2: 10 * 60 * 1000, // 10 minutes
    LEVEL_3: 30 * 60 * 1000, // 30 minutes
    LEVEL_4: 60 * 60 * 1000, // 1 hour
    LEVEL_5: 2 * 60 * 60 * 1000, // 2 hours
    LEVEL_6: 24 * 60 * 60 * 1000, // 24 hours
  },

  // Violation thresholds for escalation levels
  VIOLATION_THRESHOLDS: {
    LEVEL_2: 2, // 2 violations → Level 2 (10 min)
    LEVEL_3: 4, // 3-4 violations → Level 3 (30 min)
    LEVEL_4: 7, // 5-7 violations → Level 4 (1 hour)
    LEVEL_5: 10, // 8-10 violations → Level 5 (2 hours)
    // 11+ violations → Level 6 (24 hours)
  },

  // Cleanup intervals
  CLEANUP_INTERVAL: 24 * 60 * 60 * 1000, // 24 hours
} as const;

export interface CSRFToken {
  readonly token: string;
  readonly expires: number;
  readonly sessionId: string;
}

export interface RateLimitInfo {
  readonly count: number;
  readonly resetTime: number;
  readonly windowMs: number;
  readonly isBlocked?: boolean;
  readonly blockUntil?: number;
}

export interface RateLimitConfig {
  readonly windowMs: number;
  readonly maxRequests: number;
}

export interface SecurityEvent {
  readonly type:
    | "rate_limit"
    | "csrf_violation"
    | "spam_detected"
    | "origin_violation"
    | "progressive_block"
    | "token_generated"
    | "token_refreshed"
    | "token_expired"
    | "security_success";
  readonly ip: string;
  readonly userAgent?: string;
  readonly timestamp: string;
  readonly details?: Record<string, unknown>;
  readonly severity: "low" | "medium" | "high" | "critical";
}

export interface RateLimitResult {
  readonly allowed: boolean;
  readonly resetTime?: number;
  readonly remainingRequests?: number;
  readonly blockInfo?: BlockInfo;
}

export interface ProgressiveBlockInfo {
  readonly violations: number;
  readonly lastViolation: number;
  readonly blockUntil: number;
  readonly escalationLevel: number;
}

export interface BlockInfo {
  readonly isBlocked: boolean;
  readonly blockUntil?: number;
  readonly escalationLevel: number;
}

// =================================================
// ERROR HANDLING TYPES
// =================================================

export interface ErrorInfo {
  readonly componentStack: string | null;
  readonly errorBoundary?: string;
}

export interface ErrorBoundaryState {
  readonly hasError: boolean;
  readonly error?: Error;
  readonly errorInfo?: ErrorInfo;
}

export interface ErrorBoundaryProps extends BaseComponentProps {
  readonly fallback?: React.ComponentType<ErrorFallbackProps>;
  readonly onError?: (error: Error, errorInfo: ErrorInfo) => void;
  readonly isolate?: boolean;
}

export interface ErrorFallbackProps {
  readonly error: Error;
  readonly resetError: () => void;
  readonly componentStack?: string | null;
}

// =================================================
// FORM & VALIDATION TYPES
// =================================================

export interface FormValidationResult {
  readonly isValid: boolean;
  readonly errors: readonly string[];
}

export interface FormField<T = string> {
  readonly value: T;
  readonly error?: string;
  readonly touched: boolean;
  readonly dirty: boolean;
}

export interface ContactFormState {
  readonly name: FormField;
  readonly email: FormField;
  readonly subject: FormField;
  readonly message: FormField;
  readonly isSubmitting: boolean;
  readonly submitAttempts: number;
}

// =================================================
// API & DATA TYPES
// =================================================

export interface ApiResponse<T = unknown> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
  readonly code?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  readonly pagination: {
    readonly page: number;
    readonly limit: number;
    readonly total: number;
    readonly hasNext: boolean;
    readonly hasPrev: boolean;
  };
}

// =================================================
// UTILITY TYPES
// =================================================

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends (infer U)[]
    ? readonly DeepReadonly<U>[]
    : T[P] extends readonly (infer U)[]
    ? readonly DeepReadonly<U>[]
    : T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type NonEmptyArray<T> = readonly [T, ...T[]];

// Type guards for runtime validation
export const isTheme = (value: unknown): value is Theme => {
  return (
    typeof value === "string" &&
    ["light", "dark", "matrix", "starwars", "system"].includes(value)
  );
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

export const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === "string" && value.trim().length > 0;
};
