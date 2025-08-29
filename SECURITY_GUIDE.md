# 🛡️ Contact Form Security Implementation Guide

## Overview

This guide documents comprehensive security measures implemented for the portfolio contact form to prevent abuse, spam, and malicious attacks.

## 🚨 Security Threats Addressed

### 1. Public API Access

**Problem**: Anyone can call `/api/contact/` directly
**Solutions Implemented**:

- ✅ Origin verification (requests must come from your domain)
- ✅ Rate limiting (5 requests per 15 minutes per IP)
- ✅ Security logging and monitoring

### 2. Rate Limiting & Abuse Prevention

**Problem**: Users can spam your email with multiple requests
**Solutions Implemented**:

- ✅ IP-based rate limiting with configurable windows
- ✅ Graceful error handling with retry-after headers
- ✅ Frontend shows user-friendly rate limit messages

### 3. Bot and Spam Detection

**Problem**: Automated bots and spam submissions
**Solutions Implemented**:

- ✅ Honeypot field (invisible to humans, filled by bots)
- ✅ Content analysis for spam patterns
- ✅ Input sanitization and length limits
- ✅ Link count validation

## 🔧 Security Features Implemented

### API Route Protection (`/src/app/api/contact/route.ts`)

```typescript
// 1. Origin Verification
const allowedOrigins = [
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  "https://your-domain.com",
];

// 2. Rate Limiting
const rateLimit = checkRateLimit(request, 15 * 60 * 1000, 5);

// 3. Honeypot Validation
if (!validateHoneypot(honeypot)) {
  // Silently reject bots
}

// 4. Input Sanitization
const sanitizedData = {
  name: sanitizeInput(name),
  email: sanitizeInput(email),
  // ...
};

// 5. Spam Detection
if (detectSpam(sanitizedData)) {
  // Log and silently reject
}
```

### Frontend Security (`/src/components/pages/Contact.tsx`)

```tsx
// Hidden honeypot field
<input
  {...register("honeypot")}
  type="text"
  style={{
    position: "absolute",
    left: "-9999px",
    opacity: 0,
  }}
  aria-hidden="true"
/>;

// Rate limit error handling
if (response.status === 429) {
  const retryAfter = response.headers.get("retry-after");
  const minutes = Math.ceil(parseInt(retryAfter) / 60);
  throw new Error(`Too many requests. Please wait ${minutes} minutes.`);
}
```

### Security Middleware (`/src/middleware.ts`)

```typescript
// Security headers
response.headers.set("X-Content-Type-Options", "nosniff");
response.headers.set("X-Frame-Options", "DENY");
response.headers.set("X-XSS-Protection", "1; mode=block");
response.headers.set("Strict-Transport-Security", "max-age=31536000");

// Content Security Policy
response.headers.set("Content-Security-Policy", cspHeader);

// Block sensitive paths
if (request.nextUrl.pathname.includes("/.env")) {
  return new NextResponse("Forbidden", { status: 403 });
}
```

## 🔍 Security Monitoring

### Logging Implementation

All security events are logged with details:

```typescript
logSecurityEvent({
  type: "rate_limit" | "csrf_violation" | "spam_detected" | "origin_violation",
  ip: clientIP,
  userAgent: userAgent,
  details: {
    /* relevant data */
  },
});
```

### What Gets Logged:

- ❌ Rate limit violations
- ❌ Invalid origins
- ❌ Spam attempts
- ❌ Bot detection (honeypot)
- ✅ Successful submissions

## 🚀 Production Deployment Security

### Environment Variables

Create `.env.local` with:

```env
# Gmail Configuration
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_app_password

# Security Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### Domain Configuration

Update allowed origins in `/src/app/api/contact/route.ts`:

```typescript
const allowedOrigins = [
  "https://your-domain.com",
  "https://www.your-domain.com",
  // Add all your production domains
];
```

## 🔒 Advanced Security Measures

### 1. CAPTCHA Integration (Recommended)

For high-traffic sites, consider adding reCAPTCHA:

```bash
npm install react-google-recaptcha
```

```tsx
import ReCAPTCHA from "react-google-recaptcha";

const [captchaValue, setCaptchaValue] = useState<string | null>(null);

// In form
<ReCAPTCHA
  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
  onChange={setCaptchaValue}
/>;
```

### 2. Database Rate Limiting

For production, replace in-memory storage with Redis:

```typescript
// Instead of Map, use Redis
import { Redis } from "@upstash/redis";
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function checkRateLimit(ip: string) {
  const key = `rate_limit:${ip}`;
  const current = await redis.get(key);
  // ... rate limiting logic
}
```

### 3. IP Whitelisting/Blacklisting

```typescript
const BLOCKED_IPS = new Set([
  "192.168.1.100", // Example blocked IP
  // Add IPs from security logs
]);

const ALLOWED_IPS = new Set([
  "203.0.113.0", // Example allowed IP
  // Add trusted IPs if needed
]);

export function checkIPAccess(ip: string): boolean {
  if (BLOCKED_IPS.has(ip)) return false;
  if (ALLOWED_IPS.size > 0 && !ALLOWED_IPS.has(ip)) return false;
  return true;
}
```

## 🔍 Security Testing

### Test Rate Limiting

```bash
# Test rate limiting (should fail after 5 requests)
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/contact/ \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@example.com","subject":"Test","message":"Test message"}'
  echo "Request $i"
done
```

### Test Honeypot

```bash
# This should be silently rejected
curl -X POST http://localhost:3000/api/contact/ \
  -H "Content-Type: application/json" \
  -d '{"name":"Bot","email":"bot@example.com","subject":"Spam","message":"Spam message","honeypot":"filled_by_bot"}'
```

### Test Spam Detection

```bash
# This should be detected as spam
curl -X POST http://localhost:3000/api/contact/ \
  -H "Content-Type: application/json" \
  -d '{"name":"Spammer","email":"spam@example.com","subject":"URGENT LOAN OFFER!!!","message":"GET RICH QUICK WITH BITCOIN INVESTMENT!!!!! CLICK HERE: http://scam1.com http://scam2.com http://scam3.com"}'
```

## 🚨 Security Monitoring & Alerts

### Production Monitoring

Set up alerts for:

- High rate of blocked requests
- Spam detection triggers
- Origin violations
- Unusual traffic patterns

### Log Analysis

Monitor security logs for patterns:

```bash
# Example log analysis
grep "SECURITY" logs/app.log | grep "rate_limit" | wc -l
grep "SECURITY" logs/app.log | grep "spam_detected" | head -10
```

## 📊 Security Metrics

Track these KPIs:

- **Legitimate vs Blocked Requests Ratio**
- **Spam Detection Accuracy**
- **Rate Limit Effectiveness**
- **Origin Violations**

## 🔄 Regular Security Maintenance

### Weekly Tasks:

- Review security logs
- Update blocked IP list if needed
- Check for new spam patterns

### Monthly Tasks:

- Review and test all security measures
- Update dependencies
- Audit environment variables

### Quarterly Tasks:

- Security penetration testing
- Review and update security policies
- Performance impact analysis

## 🆘 Incident Response

### If Security Breach Detected:

1. **Immediate Response**:

   - Block malicious IPs
   - Increase rate limiting
   - Review logs for damage assessment

2. **Investigation**:

   - Analyze attack patterns
   - Check for data exposure
   - Document incident

3. **Prevention**:
   - Update security measures
   - Patch vulnerabilities
   - Enhance monitoring

## 📞 Support & Updates

- Keep this document updated with new threats
- Regular security audits recommended
- Monitor security advisories for dependencies
- Consider professional security testing for high-value sites

---

**Last Updated**: Current implementation date  
**Security Level**: Production-Ready with Advanced Protections  
**Maintenance Required**: Weekly log reviews, monthly testing

