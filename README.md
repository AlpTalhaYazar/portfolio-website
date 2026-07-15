# Alp Talha Yazar — Portfolio

A bilingual, consent-aware personal portfolio for Alp Talha Yazar. The site presents backend and full-stack engineering work, exposes a protected contact flow, and publishes localized SEO and social metadata.

Production is expected at [www.alptalha.dev](https://www.alptalha.dev). Turkish is the canonical default at `/`; English is served at `/en/`.

## What the project includes

- Turkish and English portfolio content with locale-specific metadata, canonicals, hreflang, social previews, sitemap, and privacy pages
- Responsive light and dark themes with persisted preference and reduced-motion handling
- Keyboard-operable navigation, labeled forms, announced validation state, skip navigation, and automated accessibility checks
- Consent-first Google Analytics: no Analytics component is mounted before an explicit opt-in
- A contact API with signed CSRF credentials, strict origin checks, schema validation, a honeypot, bounded payloads, rate limiting, escaped email output, and truthful delivery errors
- Redis-backed rate limiting when Upstash is configured, with endpoint-specific degraded-mode policy
- Liveness and dependency-readiness health probes
- Unit/integration coverage thresholds, cross-browser Playwright tests, dependency auditing, and GitHub Actions CI

These controls improve the tested quality baseline; they are not a blanket accessibility, security, privacy, or legal-compliance certification.

## Runtime and toolchain

| Area | Supported project version |
| --- | --- |
| Node.js | 24 LTS, `>=24.15.0 <25` |
| npm | 12, `>=12.0.1 <13` |
| Next.js | 16.2.x App Router |
| React | 19.2.x |
| TypeScript | 6.0.x |
| Tailwind CSS | 4.3.x |
| Vitest / Vite | 4.1.x / 8.1.x |
| Playwright | 1.61.x |

ESLint 9 and TypeScript 6 are intentionally the newest versions accepted by the current Next.js lint dependency graph. Do not force ESLint 10 or TypeScript 7 until every installed peer declares support.

The exact resolved versions live in the npm lockfile. Use npm only; no other package-manager lockfile is supported.

## Local setup

1. Install Node 24 and npm 12. If you use nvm, `nvm use` reads the committed runtime version.
2. Install exactly the locked dependency graph:

   ```bash
   npm ci
   ```

3. Copy the public template to a local, ignored development file:

   ```bash
   cp .env.example .env.local
   ```

4. Replace every required placeholder. Never commit plaintext credentials or a dotenvx private key.
5. Validate the development contract and start the app:

   ```bash
   npm run validate:env
   npm run dev
   ```

The development server is available at `http://localhost:3000`.

## Environment contract

Required server-only values:

- `GMAIL_USER`
- `GMAIL_APP_PASSWORD`
- `CSRF_SECRET` in production; it must contain at least 32 characters
- `EMAIL_TO` is optional and defaults to `GMAIL_USER`

Required public values:

- `NEXT_PUBLIC_BASE_URL`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_FULL_NAME`
- `NEXT_PUBLIC_CONTACT_EMAIL`
- `NEXT_PUBLIC_CONTACT_LOCATION`
- `NEXT_PUBLIC_GITHUB_URL`
- `NEXT_PUBLIC_LINKEDIN_URL`

Optional integrations:

- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`; configure both or neither

Anything prefixed with `NEXT_PUBLIC_` is compiled into browser-visible code. Never put a credential, private token, or private identifier in that namespace.

### Environment-file precedence

- Development validation: `.env.development.local`, `.env.local`, `.env.development`, then `.env`
- Production validation: `.env.production.local`, then `.env.production`
- Test validation: `.env.test.local`, `.env.test`, then `.env`
- Values already present in the process environment take precedence

The normal local production build consumes ignored plaintext values from `.env.production.local`. The encrypted deployment workflow consumes the committed ciphertext in `.env.production` and requires `DOTENV_PRIVATE_KEY_PRODUCTION` from the deployment environment. The local `.env.keys` file must never be committed or shared.

See [Contact setup](CONTACT_SETUP.md) for the mail and encrypted-production workflow.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Turbopack development server |
| `npm run lint` | Run the Next.js ESLint rules |
| `npm run type-check` | Run TypeScript without emitting files |
| `npm run validate:env` | Validate the development environment |
| `npm run validate:env:production` | Validate plaintext local production configuration |
| `npm run validate:env:production:encrypted` | Validate encrypted production configuration through dotenvx |
| `npm run test:run` | Run the Vitest suite once |
| `npm run test:coverage` | Run tests and enforce global and critical-module coverage thresholds |
| `npm run audit:dependencies` | Block high-severity full-tree advisories and moderate production advisories |
| `npm run build` | Validate plaintext production configuration and create a Turbopack production build |
| `npm run build:encrypted` | Build after decrypting the committed production env at process start |
| `npm run e2e` | Build and run the production-mode Playwright matrix |
| `npm run e2e:dev` | Run Playwright against the development server |
| `npm run analyze` | Generate a bundle analysis build |
| `npm run sync:env:production` | Replace the encrypted production env from local plaintext input |

The E2E workflow mocks contact submission; it must not send mail. Production contact-form testing requires a deliberately isolated mailbox and explicit operator approval.

## Architecture

### Request flow

Every matched request passes through the Next.js proxy. The proxy canonicalizes the Turkish default route, blocks sensitive dotfile/admin paths, applies endpoint-specific rate limits, generates a CSP nonce, propagates request context, and attaches security headers before the App Router or API handler responds.

### Locale flow

The root route renders Turkish. English uses the `/en/` prefix. The `/tr/` alias redirects permanently to the canonical root. Unsupported locale-like routes return a noindex 404. Content, metadata, social images, privacy pages, sitemap entries, and language switching share the same two-locale contract.

### Contact flow

The browser obtains a short-lived signed CSRF credential and host-scoped HTTP-only cookie, then submits the credential, session identifier, and validated form fields to the contact endpoint. The endpoint verifies origin, size, schema, CSRF signature/cookie/session binding, honeypot, and rate policy before constructing escaped text and HTML mail. A success response means the configured SMTP provider accepted the message.

### Analytics flow

The server renders no GA script by default. After hydration, the browser reads a versioned local decision. Accepting grants analytics storage only and mounts the optimized GA integration. Rejecting or withdrawing keeps Analytics disabled and sets the GA disable flag. Advertising storage, ad personalization, ad user data, and Google Signals remain denied by application code.

## Quality gates

CI runs on pull requests and pushes to `main` with read-only repository permission. It installs the pinned Node/npm toolchain and locked dependencies, then runs:

1. lint and type checking
2. development and production environment validation using non-secret CI placeholders
3. dependency audit gates
4. Vitest with coverage thresholds
5. a production build
6. Chromium, mobile Chromium, Firefox, and WebKit Playwright tests

The browser suite covers routing, navigation, contact validation with a mocked backend, consent behavior, privacy pages, responsive navigation, and automated axe checks. Manual assistive-technology and real-device review remain separate release activities.

## Deployment

Vercel is the maintained deployment target.

- The apex host redirects permanently to `https://www.alptalha.dev`.
- The deployment build command is `npm run vercel-build`.
- Inject `DOTENV_PRIVATE_KEY_PRODUCTION` as a protected production value.
- Do not add permissive static CORS headers. The APIs are same-origin and enforce origin policy in route code.
- Configure both Upstash variables for distributed production rate limiting. Without Redis, instances use bounded in-memory limits and readiness is degraded.
- Configure a unique production `CSRF_SECRET`; the build must fail if it is absent.

After deployment, verify canonical redirects, localized metadata, `/robots.txt`, `/sitemap.xml`, liveness, readiness, consent behavior, and a controlled contact delivery path.

## Operational documentation

- [Contact and email setup](CONTACT_SETUP.md)
- [Analytics and consent](GOOGLE_ANALYTICS_INTEGRATION.md)
- [Security model and runbook](SECURITY_GUIDE.md)
- [Comprehensive audit](docs/audits/2026-07-15-comprehensive-project-audit.md)

## Change checklist

Before opening a pull request:

```bash
npm run lint
npm run type-check
npm run validate:env
npm run test:coverage
npm run audit:dependencies
```

Run `npm run build` with a valid local production environment and `npm run e2e` for changes that affect routing, rendering, APIs, accessibility, consent, or deployment.

Keep Turkish and English content, metadata, privacy copy, and tests in sync. Treat new browser storage, third-party requests, public environment variables, or contact fields as privacy/security changes that require documentation and negative-path tests.

## Ownership and licensing

Portfolio claims and personal details are owner-supplied and should be confirmed by the owner before publication. This repository currently has no license file; do not assume permission to redistribute its code or content without owner review.
