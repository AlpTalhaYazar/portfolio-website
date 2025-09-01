// =================================================
// CONTACT-SPECIFIC TYPES
// =================================================

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot?: string;
  csrfToken?: string;
}

export interface ContactInfoItem {
  icon: React.ReactNode;
  title: string;
  content: string;
  href: string | null;
}

// Form validation and state types
export interface ContactFormState {
  readonly name: FormField;
  readonly email: FormField;
  readonly subject: FormField;
  readonly message: FormField;
  readonly isSubmitting: boolean;
  readonly submitAttempts: number;
}

export interface FormField<T = string> {
  readonly value: T;
  readonly error?: string;
  readonly touched: boolean;
  readonly dirty: boolean;
}

export interface FormValidationResult {
  readonly isValid: boolean;
  readonly errors: readonly string[];
}
