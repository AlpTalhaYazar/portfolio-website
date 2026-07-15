# Portfolio Reliability and Quality Hardening Design

## Status

Approved direction: the owner authorized a best-practice implementation of every audit finding on 2026-07-15, including the previously proposed privacy-first Analytics model. This document records the implementation design before code changes begin.

Source audit: `docs/audits/2026-07-15-comprehensive-project-audit.md` (`AUD-001` through `AUD-021`).

## Goals

- Close every numbered audit finding without hiding failures or weakening security controls.
- Preserve the current portfolio's visual identity and supported Turkish/English experience.
- Make contact delivery reliable on multi-instance/serverless infrastructure.
- Default to data minimization: no Analytics request before explicit consent, no advertising signals, and no collection that lacks a current product purpose.
- Establish executable release gates for security, accessibility, locale routing, metadata, APIs, and browser behavior.
- Remove unreachable parallel implementations only after reachability is proven.
- Keep the original audit immutable as a point-in-time record and produce separate remediation evidence.

## Non-goals and owner-dependent boundaries

- Do not invent career facts, project URLs, outcome metrics, testimonials, legal claims, or licenses. Conflicting numeric experience claims will be replaced by stable role/dated-timeline language rather than guessed.
- Do not send a real email, mutate production data through tests, run intrusive production scans, deploy, commit, or push without separate authorization.
- Do not activate the GA4 Internal Traffic filter until its testing behavior can be validated with real post-deployment traffic; active filters irreversibly affect future reporting.
- Privacy copy will describe observable application behavior and will be marked for owner/counsel review; it will not claim legal compliance.

## Approaches considered

### 1. Patch-only

Fix each reported line locally and leave the duplicated security/UI architecture intact. This is fast but retains competing sources of truth, fragile serverless assumptions, and weak regression protection.

### 2. Full rewrite

Replace the application and contact stack. This could simplify the end state but would discard working content, metadata, tests, and visual design while creating a large regression surface.

### 3. Phased reliability hardening — selected

Add behavior-first tests, replace unsafe boundaries behind stable contracts, then remove proven-dead code. This closes root causes while keeping each change independently verifiable and reversible.

## Target architecture

### Request, proxy, and public metadata

- Normalize and compare sensitive paths by exact path segment. Public framework metadata routes (`/robots.txt`, `/sitemap.xml`, icons and manifest) bypass the sensitive-path block while still receiving applicable security headers.
- Rate-limit only API endpoints. The proxy supplies a CSP nonce and trusted request-context headers to App Router code.
- Use one canonical site configuration for origin checks, metadata, sitemap, robots, structured data, and social images.
- Standardize API errors as stable public codes/messages; parser, SMTP, Redis, and stack details remain server-side.

### Stateless CSRF and contact submission

- Replace the module-level CSRF store with a signed, expiry-bound token. The token contains a version, random nonce, issued-at/expiry, and a session identifier; an HMAC protects integrity using a production-required server secret.
- Issue the token in the response body and a host-only, `HttpOnly`, `Secure`-in-production, `SameSite=Strict` cookie. Submission requires the cookie, request token, session header, and allowed Origin/Referer to agree.
- Use timing-safe comparison and accept tokens across instances without Redis or in-process state.
- Token refresh returns credentials directly; the same submit attempt uses that returned value rather than stale React state.
- Malformed JSON returns `400 invalid_json`; schema failures return a sanitized `422`; CSRF/origin failures return `403`; rate limits return `429`; dependency unavailability returns retryable `503`; successful delivery alone returns success.
- Keep the honeypot, remove broad business-keyword rejection, and use layered low-false-positive signals (honeypot, bounded link/repetition checks, request timing, rate limits). Suspicious automated submissions may receive a generic accepted response only when durable privacy-minimized telemetry records the disposition; legitimate content is never silently dropped by topic.
- HTML-escape every untrusted email scalar at the rendering boundary, retain a plain-text alternative, and never place untrusted text in mail headers except Nodemailer's validated address/reply-to APIs.

### Rate limiting and dependency health

- Give every policy an explicit stable name; Redis and memory keys include policy plus a privacy-preserving client identifier.
- Bound in-memory stores by size and TTL, clean them deterministically, and isolate endpoint counters.
- When Redis is configured but unavailable, contact delivery fails closed with a short `503` rather than silently becoming unlimited. Low-impact endpoints may use the bounded local fallback and expose a degraded decision.
- Separate liveness from readiness. Liveness is local and cheap. Readiness uses bounded, non-mutating Redis and SMTP probes, short timeouts, a small cache/circuit-breaker window, aggregate public status, and detailed redacted structured logs.
- Preserve production logs by removing compilation that erases them. Emit structured JSON with event codes/request IDs and a recursive denylist for credentials, raw tokens, full message bodies, email addresses, and raw IP addresses.

### Environment and deployment contracts

- Production validation consumes existing process variables or the explicitly encrypted production file; it never gains validity from `.env.local` or `.env.development*`.
- Development validation follows Next.js development precedence. Tests inject their own environment and never inspect secret-bearing files.
- Validate paired Redis variables together, require a strong CSRF signing secret in production, and distinguish required delivery configuration from optional Analytics/search verification.
- Add reproducible CI gates using `npm ci`, pinned Node/npm expectations, lint, type-check, environment-contract tests, unit/coverage, production build, and Playwright. CI uses inert non-secret placeholders and route mocks; no email or external mutation is possible.

### Theme, accessibility, and motion

- The server and first client render use a neutral theme contract. A nonce-bearing bootstrap sets only root theme attributes before paint; theme-dependent React output is deferred until hydration or uses CSS selectors so markup does not diverge.
- Persist the preference locally, honor the OS preference when no explicit choice exists, avoid a flash, and cover `hydrateRoot` with both stored themes.
- Implement the mobile menu as a modal navigation surface with initial focus, focus containment, Escape dismissal, background isolation, scroll locking, and focus restoration.
- Give every form control a stable ID and explicit label. Associate errors through `aria-describedby`, set `aria-invalid`, focus the first invalid field, and announce loading/error/success through appropriately scoped live regions.
- Raise text/placeholder colors to at least WCAG 2.2 AA contrast for normal text and retain visible focus indicators in both themes.
- Use Framer Motion's reduced-motion signal and CSS media queries to eliminate non-essential transforms, delayed entrances, smooth scrolling, and transition work when requested.

### Privacy-first Analytics

- Remove unconditional `GoogleAnalytics` rendering.
- Add a localized consent provider and accessible preference dialog. Default is denied; the GA script and requests do not exist until explicit opt-in. Rejection is as easy as acceptance, and preferences remain available from the footer.
- Store only a versioned Analytics boolean and timestamp in a first-party consent cookie/local preference. A policy-version change asks again.
- Use Analytics only; advertising storage, ad personalization, Google Signals, and user-provided data remain disabled.
- Add factual localized privacy information covering optional Analytics, contact-form processing, retention intent, and preference withdrawal, with an explicit owner/counsel review marker in documentation rather than a compliance claim in UI.
- GA4 admin target: keep email redaction enabled, enable query-parameter redaction, retain only page views/scrolls/outbound clicks/file downloads that have a product purpose, disable unused search/video/form auto-events, minimize retention and reset behavior, and link the already verified Search Console property. Any irreversible filter activation remains blocked pending validation.

### Locale, SEO, PWA, and content integrity

- Public locales remain Turkish at `/` and English at `/en/`; `/tr/` permanently redirects to `/`, and unsupported locales return a real localized-safe 404 without inheriting English canonical metadata.
- Remove Spanish content/types/translations because no public Spanish route or maintained parity exists. This reduces misleading support claims rather than silently publishing incomplete copy.
- Generate canonical, hreflang, sitemap, robots, Open Graph, Twitter, and structured-data values from the same locale/site primitives.
- Replace stale numeric experience claims in global/PWA metadata with durable role language; dated experience entries remain the evidence source.
- Make the manifest truthful to available icons and language behavior. Add only generated icons that are actually present and validated.

### Component ownership and performance

- `src/components/portfolio` is the maintained design system. Prove import reachability from App Router roots, then remove unused parallel `pages`, `layout`, legacy `theme`, and legacy `ui` trees plus obsolete barrels/data/translations.
- Keep server components at route/content/metadata boundaries and isolate only interaction state (theme, menu, projects, form, consent) as client components.
- Avoid speculative micro-optimization. Measure production build output and browser behavior; remove packages or client boundaries only when reachability/bundle evidence supports it.

### Dependency and supply-chain policy

- Establish executable regression gates before runtime upgrades.
- Upgrade advisory-affected direct dependencies in isolated compatible batches, keeping Next/React/ESLint coupling aligned and reviewing official release/security notes.
- Re-run `npm audit --omit=dev` and full audit after every batch; document residual dev-only advisories and reachability rather than forcing incompatible upgrades.
- Add the Vitest coverage provider and enforce meaningful global thresholds that the current suite can meet, then ratchet coverage around critical modules.

## Testing strategy

Every production behavior change follows red-green-refactor:

1. Add or strengthen a test that fails for the audited behavior.
2. Run the smallest relevant test and confirm the expected failure.
3. Implement the minimal safe change.
4. Re-run the focused test, then the affected suite.
5. Refactor only while green.

Required gates include:

- Proxy/metadata integration: robots, sitemap, redirects, unsupported locales, CSP nonce propagation.
- CSRF: cross-instance acceptance, tamper/expiry/cookie/origin rejection, refresh-and-submit freshness.
- Contact: malformed JSON, schema errors, honeypot, legitimate security-domain copy, safe SMTP stub, encoding, timeout/failure mapping.
- Rate limit/health: Redis success/error/recovery, policy isolation, bounds/TTL, SMTP/Redis readiness timeouts and redaction.
- Accessibility: hydration, keyboard menu, form associations/live regions, reduced motion, automated axe checks at representative viewports/themes/locales.
- SEO/PWA: canonical/hreflang, structured data, manifest assets, robots/sitemap content.
- Browser: approximately 360x800, 768x1024, and 1440x900; Turkish/English; light/dark; consent accept/reject/withdraw; navigation; projects; contact validation; 404; console/network cleanliness.

## Delivery sequence

1. Establish repository modes, baseline tests, coverage tooling, and CI-safe test seams.
2. Fix public metadata routing and API error contracts.
3. Replace CSRF/rate limiting/email/health/logging/environment boundaries.
4. Fix theme hydration, accessibility, contrast, menu, form semantics, and reduced motion.
5. Implement consent-first Analytics, privacy surfaces, locale/SEO/PWA consistency, then apply reversible GA4 settings.
6. Remove proven-dead legacy code and reconcile documentation.
7. Upgrade dependencies in verified batches.
8. Run complete static, unit, coverage, production-build, E2E, browser, accessibility, dependency, and passive-production checks; produce a remediation ledger mapping evidence to every audit ID.

## Rollback and safety

- Keep changes unstaged and local unless the owner asks for Git operations.
- Never overwrite unrelated untracked files.
- Keep external Analytics changes separate from code changes and record before/after state. Do not activate an unvalidated data filter or submit a production contact form.
- If a dependency batch breaks a gate, restore only that batch with targeted patches/lockfile regeneration; do not reset the worktree.
- A finding is closed only with fresh evidence. Environment/tool blockers remain explicitly open rather than being represented as passes.

## Completion criteria

- `AUD-001` through `AUD-021` each have a remediation status and fresh verification evidence.
- Lint, type-check, development/production environment validation, unit tests, coverage, production build, and safely mocked E2E all execute successfully, or an exact external/tool blocker is documented.
- Browser QA has no application console errors, failed first-party requests, hydration recovery, keyboard traps, or consent-before-Analytics requests.
- `npm audit` residuals are either zero for production dependencies or explicitly documented with current advisory/reachability evidence.
- The final worktree contains only intentional implementation/docs/lockfile changes plus preserved user-owned untracked files; nothing is staged, committed, pushed, or deployed without authorization.
