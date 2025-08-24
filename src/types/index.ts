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
