interface BuildCSPHeaderOptions {
  nonce: string;
  isDevelopment?: boolean;
}

export function buildCSPHeader({
  nonce,
  isDevelopment = process.env.NODE_ENV !== "production",
}: BuildCSPHeaderOptions): string {
  const scriptSources = [
    "'self'",
    `'nonce-${nonce}'`,
    "'strict-dynamic'",
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
  ];

  if (isDevelopment) {
    scriptSources.splice(3, 0, "'unsafe-eval'");
  }

  const cspDirectives = [
    "default-src 'self'",
    `script-src ${scriptSources.join(" ")}`,
    // Framer Motion, Next font styles, and the dev overlay rely on inline style tags/attributes.
    "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
    "style-src-attr 'unsafe-inline'",
    "font-src 'self' fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com",
    "upgrade-insecure-requests",
  ];

  return cspDirectives.join("; ");
}
