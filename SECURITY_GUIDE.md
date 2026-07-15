# Security Model and Operations Guide

This guide documents the controls currently implemented in the portfolio and the checks maintainers must perform when changing or operating them. It is an engineering description, not a penetration-test report, legal opinion, or guarantee of security.

## Scope and trust boundaries

The main boundaries are:

1. an untrusted public browser crossing the Next.js proxy
2. the browser calling same-origin CSRF, contact, and health APIs
3. server code calling Gmail SMTP and optional Upstash Redis
4. build/deployment code loading plaintext or encrypted environment configuration
5. application logs leaving the process for an external platform
6. an accepted browser session loading Google Analytics

User-controlled input includes URL paths, headers, locale segments, contact fields, cookies, JSON bodies, and analytics choices. SMTP, Redis, Vercel, Google Analytics, DNS, and mailbox retention are external systems with independent configuration and failure modes.

## Request protection

The proxy applies controls before matched pages and APIs:

- canonical redirect for the default Turkish locale
- segment-aware blocking of `.git`, `.env`, and admin paths, including encoded or malformed paths
- endpoint-specific rate limiting
- per-request cryptographic CSP nonce propagated to server rendering
- `nosniff`, frame denial, referrer, HSTS in production, permissions policy, and nonce-based CSP
- structured request-context headers

Static Next.js assets and the favicon are excluded from the proxy matcher. Robots and sitemap remain public.

The CSP permits the minimum currently required Google Analytics destinations plus local application resources. Inline styles remain allowed because the current styling/runtime stack requires them; this is residual XSS hardening debt, not evidence of a known injection path. Do not add `unsafe-inline` to scripts.

## Origin and CORS policy

APIs are same-origin. Contact and CSRF handlers compare the parsed `Origin` or `Referer` origin against the configured site/base origins. Production rejects missing, malformed, lookalike, subdomain, or port-mismatched origins.

Development allows exact loopback hostnames. It does not use suffix matching.

Vercel does not add broad static CORS headers. If a future cross-origin client is required, design a specific authenticated API contract and test preflight, allowed headers, credentials, caching, and origin variation. Do not solve it with `Access-Control-Allow-Origin: *`.

## CSRF lifecycle

CSRF credentials are stateless HMAC-SHA256 tokens signed with `CSRF_SECRET`. Each token contains a random session identifier, nonce, issuance time, and one-hour expiry.

Validation requires all of the following:

- a token in the JSON payload
- the same token in an HTTP-only strict same-site cookie
- a valid HMAC signature checked with timing-safe comparison
- a supported version and well-formed payload
- current time within the token lifetime
- an `x-session-id` header matching the signed session identifier

Production uses a secure `__Host-` cookie. The client refreshes before the final five minutes. Because the token is stateless and signed by a shared secret, independent serverless instances can issue and verify it consistently.

`CSRF_SECRET` is required in production and must be unique, random, at least 32 characters, and server-only. Rotating it invalidates outstanding tokens.

## Contact validation and email safety

The contact endpoint:

- limits declared payload size to 16 KiB
- catches malformed JSON and returns a stable 400 response
- validates type, trimming, email format, and field lengths with a strict schema
- uses a hidden honeypot for basic automation resistance
- normalizes CR/LF from subject/header values
- escapes untrusted content in HTML templates
- produces a plain-text alternative
- uses the submitted email only as `replyTo`
- disables Nodemailer file and URL access
- enforces TLS certificate validation and short SMTP timeouts
- returns success only after SMTP accepts the message
- maps delivery failures to a generic 503 without provider detail

The honeypot intentionally returns a generic 200 acknowledgement to automation but does not send mail. Do not add broad keyword filters that silently discard plausible human messages.

## Rate limiting

| Policy | Limit | Window | Redis failure behavior |
| --- | ---: | ---: | --- |
| Contact | 5 | 15 minutes | Fail closed with 503 |
| CSRF issuance | 10 | 5 minutes | Bounded memory fallback |
| Health | 30 | 1 minute | Bounded memory fallback |
| Other API routes | 20 | 10 minutes | Bounded memory fallback |

The limiter prefers Vercel, Cloudflare, forwarded, then real-IP headers. It derives a fixed-length HMAC identifier using the CSRF secret; logs and limiter state do not retain the raw address. This still relies on the deployment platform to sanitize forwarded headers.

Redis policy keys include the endpoint policy name, so unrelated endpoints do not consume one another's quota. In-memory state is capped and expired entries are removed. Memory mode is per process and therefore cannot guarantee a global serverless quota.

Configure both Upstash values or neither. Partial configuration is invalid. Production contact protection should use Redis when cross-instance consistency matters.

## Secrets and environment loading

Server secrets:

- Gmail App Password
- CSRF signing secret
- Upstash token
- dotenvx production private key

Public build values use `NEXT_PUBLIC_` and must be assumed visible to every visitor.

Development and production validation use separate file precedence. Production does not read `.env.local`, preventing a developer's local values from masking missing deployment configuration.

The committed production env is encrypted ciphertext. The private key remains outside git and is injected at deployment. Never print, paste, decrypt for review, or commit plaintext production values. If a key or credential appears in a terminal, screenshot, issue, commit, or chat, rotate it.

npm 12 blocks unreviewed install scripts. The project explicitly allows only pinned versions required by `esbuild`, `sharp`, and `unrs-resolver`, and denies `fsevents` lifecycle scripts. Review this allowlist on every dependency update.

## Logging and privacy

Application events are structured JSON and remain enabled in production. The logger recursively redacts:

- token, secret, credential, authorization, cookie, session, and CSRF-like keys
- email addresses and IP-like values
- message/body/content-like keys
- Error objects beyond their name
- deeply nested, circular, or oversized data

Security events use stable names and privacy-minimized metadata. Do not log contact payloads, mail addresses, raw client identifiers, complete third-party errors, environment objects, request cookies, or tokens.

Logging is not monitoring. The deployment still needs retention policy, access control, alert routing, and dashboards for delivery failures, unhealthy readiness, repeated rate limits, and origin/CSRF rejection trends.

## Health semantics

`GET /api/health?probe=liveness` reports process availability without contacting dependencies.

`GET /api/health` is readiness. It actively verifies SMTP and, when configured, Redis with bounded timeouts. Results are cached for 30 seconds:

- `healthy`: SMTP and Redis are available
- `degraded`: SMTP is available and Redis is intentionally disabled
- `unhealthy`: SMTP fails, Redis configuration is invalid, or a configured dependency fails

Unhealthy readiness returns 503 and `Retry-After`. The response exposes dependency categories, not endpoints, credentials, or provider error detail.

## Failure-mode expectations

| Failure | Expected behavior |
| --- | --- |
| Missing production CSRF secret | Validation/build failure |
| Malformed or expired CSRF token | 403, no email |
| Oversized or invalid contact payload | 413 or 422, no email |
| Redis outage on contact | 503 fail-closed |
| Redis outage while rate-limiting CSRF/health | Bounded degraded memory limiting; readiness still reports the dependency failure |
| SMTP configuration or delivery failure | 503, generic client message |
| Invalid locale or nested route | noindex 404 |
| Analytics rejected or unset | no GA component or Google request |
| Logger receives PII-shaped data | recursively redacted output |

## Dependency and CI controls

The lockfile is the install source of truth. CI uses `npm ci`, checks peer validity through normal installation, runs lint/type/tests/build/E2E, and enforces:

- no high-or-higher advisory in the complete tree
- no moderate-or-higher advisory in production dependencies
- global and critical-module coverage thresholds

An audit result is a time-bound registry snapshot. Re-run it before releases and review overrides after upstream packages publish fixed dependencies.

## Verification matrix

Run after security-sensitive changes:

```bash
npm run lint
npm run type-check
npm run validate:env
npm run validate:env:production
npm run test:coverage
npm run audit:dependencies
npm run build
npm run e2e
```

Also verify locally:

- exact and lookalike origins
- missing, mismatched, tampered, future, and expired CSRF credentials
- malformed JSON, 16 KiB boundary, and field-length boundaries
- honeypot acknowledgement without SMTP
- Redis configured, absent, partial, and unavailable states
- SMTP timeout/failure without error disclosure
- liveness versus readiness
- CSP nonce propagation and security headers
- no analytics network request before consent
- keyboard and screen-reader behavior for form errors and consent controls

Use mocks for email, Redis failures, and browser analytics. Do not run brute force, load tests, real production form submissions, or intrusive scanners against the public site.

## Residual risks and owner decisions

- In-memory rate limits are not global across serverless instances.
- Forwarded-IP trust depends on the hosting edge.
- The contact API has no idempotency key; a user retry after an ambiguous network failure could deliver twice.
- Honeypot and rate limits are the current spam controls; there is no CAPTCHA or challenge.
- Gmail and the destination mailbox determine message retention and access.
- CSP still permits inline styles.
- GA property retention, enhanced measurement, filters, and linking live outside source control.
- There is no repository license or formal incident-response owner documented.

These are not automatic release blockers in every context. The owner should assign risk, retention, alerting, and operational responsibilities before treating the service as unattended production infrastructure.

## Incident response

If abuse, leakage, or suspicious behavior is suspected:

1. preserve relevant structured logs without copying secrets or message content
2. disable the affected integration or fail the route closed
3. rotate exposed Gmail, Redis, CSRF, or dotenvx credentials
4. check deployment environment history and repository history
5. verify readiness and the negative-path test matrix
6. document scope, timeline, containment, and follow-up owners
7. obtain specialist or legal review when personal data or regulatory obligations may be involved
