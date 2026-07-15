# Contact and Email Setup

This runbook is for maintainers who need to configure, verify, deploy, or rotate the portfolio contact integration without exposing credentials or accidentally sending test mail.

## Behavior at a glance

The public form:

1. fetches a signed, one-hour CSRF credential
2. keeps the matching token in an HTTP-only cookie that is Secure in production
3. validates fields in the browser for usability
4. submits JSON with a session identifier to the same-origin contact API
5. receives success only after the configured SMTP provider accepts the message

The server independently verifies origin, request size, JSON shape, field limits, CSRF signature/cookie/session binding, honeypot state, and rate policy. It normalizes mail headers, escapes all untrusted HTML, disables file/URL access in Nodemailer, and applies short connection/socket timeouts.

The application does not persist contact submissions in its own database. The destination mailbox and email provider control downstream retention.

## Contact-critical configuration

The table below highlights the values that directly govern the contact flow. The full application validator also requires the public portfolio identity and social-link values listed in `.env.example`; begin from that complete template instead of constructing an env file from this table alone.

| Variable | Exposure | Requirement |
| --- | --- | --- |
| `GMAIL_USER` | Server only | Gmail or Google Workspace sender address |
| `GMAIL_APP_PASSWORD` | Server only | App Password; never the account password |
| `EMAIL_TO` | Server only | Optional destination; defaults to `GMAIL_USER` |
| `CSRF_SECRET` | Server only | Required in production; unique random value of at least 32 characters |
| `NEXT_PUBLIC_BASE_URL` | Public | Canonical HTTPS site URL |
| `NEXT_PUBLIC_SITE_URL` | Public | Allowed same-origin site URL |
| `UPSTASH_REDIS_REST_URL` | Server only | Optional; must be paired with the token |
| `UPSTASH_REDIS_REST_TOKEN` | Server only | Optional; must be paired with the URL |

`GMAIL_APP_PASSWORD`, `CSRF_SECRET`, Redis credentials, and dotenvx private keys must never use a `NEXT_PUBLIC_` prefix.

## Prepare the Gmail account

1. Enable two-step verification on the sender account.
2. Create a dedicated App Password for this portfolio deployment.
3. Store the generated App Password only in ignored local env files and the deployment secret store.
4. Use a dedicated sender/mailbox when possible so rotation, retention, and access can be managed independently.

If App Passwords are unavailable, check the account type and organization policy. Do not weaken account security or put a normal Google password in the application.

## Local development

Create the ignored local file from the public template:

```bash
cp .env.example .env.local
```

Populate all required values, then run:

```bash
npm run validate:env
npm run dev
```

The UI can be exercised safely without sending mail by running the automated tests:

```bash
npm run test:run -- src/app/api/contact/route.test.ts
npm run e2e
```

The Playwright contact flow intercepts the API request. Do not replace that mock with a real mailbox in routine CI.

## Production configuration

The repository supports two deliberate production paths.

### Local plaintext verification

Keep production values in ignored `.env.production.local`, then run:

```bash
npm run validate:env:production
npm run build
```

Production validation intentionally ignores `.env.local`; development values cannot silently satisfy the production contract.

### Encrypted repository workflow

The committed `.env.production` file contains dotenvx ciphertext, not plaintext. The local `.env.keys` file contains private decryption material and must remain ignored.

To replace the encrypted production file:

1. review `.env.production.local` for the complete intended production set
2. confirm `.env.keys` is present locally and protected
3. run `npm run sync:env:production`
4. inspect only the encrypted diff and variable names; never paste values into logs or reviews
5. validate with `npm run validate:env:production:encrypted`

For Vercel, store `DOTENV_PRIVATE_KEY_PRODUCTION` in the protected production environment and use `npm run vercel-build`. Rotate the key if it is ever copied to an untrusted location.

## API contract

### CSRF endpoint

`GET /api/csrf-token` returns a signed token, session identifier, absolute expiry, and TTL. It also sets a strict same-site HTTP-only cookie. Production uses a `__Host-` cookie name, requires HTTPS, and scopes the cookie to `/`.

Expected responses:

| Status | Meaning |
| --- | --- |
| 200 | Credential issued |
| 403 | Origin missing, malformed, or not allowed |
| 429 | Endpoint rate limit exceeded |
| 503 | Credential signing or request protection unavailable |

### Contact endpoint

`POST /api/contact` accepts `name`, `email`, `subject`, `message`, optional `honeypot`, and `csrfToken`. The `x-session-id` header must match the signed token payload.

Limits:

- request body: 16 KiB maximum
- name: 2–100 characters
- email: valid address, 254 characters maximum
- subject: 5–200 characters
- message: 10–5,000 characters
- CSRF token: 4,096 characters maximum

Expected responses:

| Status | Meaning |
| --- | --- |
| 200 | SMTP accepted the mail, or an automation honeypot received a generic acknowledgement |
| 400 | Invalid JSON |
| 403 | Origin or CSRF validation failed |
| 413 | Request body too large |
| 422 | Field validation failed |
| 429 | Contact rate limit exceeded |
| 503 | Rate-limit protection, mail configuration, or SMTP delivery unavailable |

A 503 delivery response includes a short `Retry-After` value. Clients must not display a success state for it.

## Rate limiting

The contact policy allows five requests per 15 minutes per privacy-minimized client identifier. Identifiers are HMAC-derived and raw IP/user-agent values are not stored by the limiter.

- With both Upstash values present, the limit is shared across serverless instances.
- With neither value present, a bounded per-process memory limiter is used.
- With partial Redis configuration or a Redis outage, contact submission fails closed with 503.
- CSRF and health policies may degrade to the bounded memory limiter.

Production should configure Redis when consistent cross-instance abuse protection is required.

## Safe verification

Run these checks after any contact/security change:

```bash
npm run lint
npm run type-check
npm run validate:env
npm run validate:env:production
npm run test:coverage
npm run build
npm run e2e
```

For a real delivery smoke test, obtain explicit operator approval, use a staging or dedicated mailbox, submit only synthetic data, and verify exactly one message. Never submit the production contact form as part of automated auditing.

## Troubleshooting

### Production validation reports a missing CSRF secret

Set a unique 32+ character `CSRF_SECRET` in the production source or deployment environment. Do not reuse the development fallback.

### The form reports security initialization failure

Verify the request is using the exact configured origin, the CSRF endpoint is reachable, cookies are enabled, and the token/session header have not expired. Do not relax same-origin checks.

### The form reports temporary delivery failure

Check structured server logs for the event name, then verify the Gmail account, App Password, network egress, and destination address. Logs intentionally redact addresses, tokens, content, IPs, and error details.

### Requests receive 429

Respect `Retry-After`. Confirm whether Redis is configured and whether the same client is repeatedly exercising the endpoint. Do not increase limits before reviewing abuse and conversion data.

### Readiness is unhealthy

The readiness probe actively verifies SMTP and, when configured, Redis. Use the liveness probe to distinguish process availability from dependency availability. Readiness results are cached briefly to avoid turning health checks into dependency load.

## Rotation checklist

1. create a new Gmail App Password or Redis token
2. update the ignored local production source and deployment secret
3. regenerate encrypted production configuration when applicable
4. validate and deploy
5. confirm readiness
6. revoke the old credential
7. review logs for unexpected failures without printing credential values
