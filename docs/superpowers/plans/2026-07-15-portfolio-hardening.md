# Portfolio Reliability and Quality Hardening Implementation Plan

> **Execution rule:** follow red-green-refactor for every behavior change. Keep the work unstaged and local; do not commit, push, deploy, send email, or submit the production contact form.

**Goal:** Close `AUD-001` through `AUD-021`, add durable release gates, and implement the approved privacy-first Analytics model without fabricating owner facts.

**Architecture:** Preserve the App Router and `src/components/portfolio` UI, replace process-local security state with stateless/shared-safe contracts, make dependency failures explicit, and remove legacy code only after reachability proof. Keep Turkish `/` and English `/en/` as the only public locales.

**Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, Zod, Nodemailer, optional Upstash Redis, Vitest/Testing Library, Playwright, Vercel.

**Design:** `docs/superpowers/specs/2026-07-15-portfolio-hardening-design.md`

---

## Task 0: Safeguard the worktree and normalize repository modes

**Files:** all tracked files (mode only); preserve `.codex/**`, `docs/plans/2026-03-22-linkedin-forceget-positioning.md`, and the audit.

1. Capture `git status --short --branch`, `git diff --summary`, content diff, staged diff, HEAD, Node, and npm versions.
2. Prove the tracked changes are mode-only with `git diff --numstat` and blob comparisons.
3. Add/strengthen `src/lib/repo-conventions.test.ts` so unexpected executable source/config/docs files fail.
4. Run the focused test and confirm it fails against the current 100755 worktree.
5. Restore each tracked file's filesystem mode to the mode recorded in HEAD without touching contents or index state; do not run reset/checkout/clean.
6. Re-run the convention test and verify `git diff --summary` no longer reports the global mode anomaly.

## Task 1: Make quality gates executable before riskier changes

**Files:** `package.json`, `package-lock.json`, `vitest.config.ts`, `playwright.config.ts`, `.github/workflows/ci.yml` (new), `.nvmrc` (new if compatible with Vercel), relevant test setup.

1. Run the unchanged baseline gates and save exact exit codes.
2. Install only the missing compatible coverage provider and `@axe-core/playwright`; update the lockfile through npm, never by hand.
3. Add coverage thresholds initially set just below fresh measured baseline, with critical security/API modules explicitly included.
4. Make Playwright use the production build/server for release tests and keep a separate fast local-dev mode only if documented.
5. Add Chromium desktop/mobile projects and Firefox/WebKit release projects; browser installation remains an explicit environment prerequisite.
6. Add CI using `npm ci`, lint, type-check, environment-contract tests, unit/coverage, build, and mocked Playwright. Supply inert placeholder environment values and prohibit outbound SMTP.
7. Run `npm run test:coverage` and the configuration-focused tests; confirm coverage is now executable.

## Task 2: Fix proxy/public metadata and route contracts (`AUD-001`, part of `AUD-020`)

**Files:** `src/proxy.ts`, `src/proxy.test.ts` (new), `src/app/robots.ts`, `src/app/sitemap.ts`, related route tests.

1. Write failing proxy tests for `/robots.txt`, `/sitemap.xml`, dotfiles, traversal-like paths, `/admin`, `/tr`, `/tr/`, and API header propagation.
2. Confirm current public metadata cases return 403 in the focused test/runtime probe.
3. Replace substring blocking with normalized exact/segment-aware sensitive-path rules; allow framework metadata routes.
4. Keep nonce/security headers on successful responses and preserve the permanent Turkish redirect.
5. Re-run focused tests and local production curl checks for status, content type, canonical host, and locale URLs.

## Task 3: Replace process-local CSRF state (`AUD-003`, `AUD-019`)

**Files:** `src/lib/csrf.ts` (new), `src/lib/csrf.test.ts` (new), `src/app/api/csrf-token/route.ts`, `src/app/api/csrf-token/route.test.ts` (new), `src/hooks/useCSRFSecurity.ts`, `src/hooks/useCSRFSecurity.test.tsx`, `src/hooks/useContactSubmission.ts`, `.env.example`, env schemas/tests.

1. Write failing tests for token issue/verify, tampering, expiry, wrong session/cookie/origin, timing-safe comparison, and acceptance by a fresh module/process instance.
2. Add a production-required `CSRF_SECRET` schema with safe test injection and no secret logging.
3. Implement compact versioned HMAC tokens using Node crypto and a host-only HttpOnly SameSite cookie.
4. Make the token endpoint return a stable credential payload and explicit no-store/cache headers.
5. Write a failing hook test proving refresh-and-submit currently posts stale credentials.
6. Change `fetchCSRFToken` to return the fresh payload and make the submission use it immediately.
7. Add safe JSON parsing and stable public error codes; verify malformed JSON returns 400 without parser details.
8. Run focused CSRF/hook/route tests, then the security suite.

## Task 4: Redesign rate-limit identity and outage behavior (`AUD-004`)

**Files:** `src/lib/redis-rate-limit.ts` (or focused replacement modules), `src/lib/redis-rate-limit.test.ts` (new), `src/proxy.ts`, `src/types/contact.ts`, `src/types/index.ts`.

1. Write failing tests for Redis success, timeout/error, recovery, unconfigured Redis, policy isolation, shared IPs, TTL/reset, escalation, and bounded store eviction.
2. Add a named policy to each API rate-limit configuration and include it in Redis/memory keys.
3. Hash client identifiers with a scoped server secret before persistence/logging; treat proxy headers according to the Vercel trust boundary.
4. Bound fallback maps by maximum entries and expiry; remove the duplicate legacy limiter from `security.ts` when no caller remains.
5. Return an explicit backend/degraded outcome. Fail contact closed with retryable 503 when configured Redis is unavailable; allow documented bounded fallback only for low-impact endpoints.
6. Make `Retry-After` and rate-limit headers valid, non-negative, and consistent.
7. Run focused tests and proxy/API integration tests.

## Task 5: Make contact parsing, spam handling, and email rendering honest (`AUD-005`, `AUD-006`, `AUD-019`)

**Files:** `src/app/api/contact/route.ts`, `src/app/api/contact/route.test.ts` (new), `src/lib/email-templates/components.ts`, `src/lib/email-templates/builder.ts`, `src/lib/email-templates/escape.ts` (new), email tests, `src/lib/security.ts`, contact types.

1. Write route tests with a non-delivering transporter for success, malformed JSON, schema failure, origin/CSRF failure, honeypot, legitimate messages containing former spam keywords, obvious automation, SMTP timeout, and SMTP rejection.
2. Write email-rendering tests for `<`, `>`, `&`, quotes, Unicode, header-like input, user agent, and request-context values.
3. Implement escape-by-default text interpolation at the HTML boundary and retain a readable plain-text part.
4. Remove topic keyword blocking. Keep only low-false-positive automation signals and explicit privacy-minimized disposition logs.
5. Return success only for actual delivery (except an unambiguously filled honeypot's anti-bot generic response); map failures to stable retryable/non-retryable statuses.
6. Ensure the response and logs never expose raw parser/SMTP errors, message bodies, tokens, full addresses, or raw IPs.
7. Run focused route/template tests and verify no transporter call can reach the network in test mode.

## Task 6: Add truthful health, logging, and environment behavior (`AUD-007`, `AUD-016`, `AUD-018`)

**Files:** `src/app/api/health/route.ts`, its tests, `src/lib/health.ts` (new if separation helps), `src/lib/logger.ts`, logger tests, `src/lib/env-loading.ts`, `scripts/validate-env.ts`, env tests, `next.config.ts`, `.env.example`, deployment docs.

1. Write failing tests for liveness, Redis/SMTP readiness success, timeout, auth failure, optional absence, recovery, redacted output, and 503 semantics.
2. Implement bounded non-mutating probes (`Redis ping`, `transporter.verify`) behind dependency injection, short timeout, and brief cached/circuit state.
3. Return only aggregate public readiness details; log actionable redacted event codes with request IDs.
4. Write logger redaction tests for nested credential/token/email/IP/message fields.
5. Remove production compilation that deletes logs; preserve structured warn/error/security events without noisy debug output.
6. Write a failing production-precedence test where `.env.local` could incorrectly satisfy validation.
7. Make production loading ignore development/local env files unless values were explicitly injected; validate Redis variable pairs and CSRF secret strength.
8. Run health/logger/env tests plus both validation scripts using safe existing prerequisites.

## Task 7: Fix theme hydration, accessibility, contrast, and reduced motion (`AUD-008`–`AUD-011`, `AUD-021`)

**Files:** `src/app/layout.tsx`, `src/app/globals.css`, theme script/provider/tests, `src/components/portfolio/Header.tsx`, `Header.test.tsx` (new), `ContactForm.tsx` and tests, animated portfolio components/tests.

1. Add a `hydrateRoot` regression test for stored light/dark/system preferences and assert no recoverable hydration errors.
2. Refactor theme-dependent UI so server and first client markup agree while the nonce bootstrap prevents color flash.
3. Add failing keyboard tests for mobile-menu initial focus, Tab containment, Shift+Tab, Escape, background isolation, close-on-navigation, and trigger focus restoration.
4. Implement the modal navigation contract and body-scroll cleanup.
5. Add failing form tests for explicit labels/IDs, `aria-describedby`, `aria-invalid`, live announcements, and first-error focus; implement the associations.
6. Calculate both-theme contrast for all text/placeholder tokens and update only failing tokens to WCAG 2.2 AA values.
7. Add reduced-motion tests and use Framer Motion/CSS preferences to remove non-essential transforms, delays, smooth scrolling, and transitions.
8. Run component tests and automated axe browser checks in both locales/themes at mobile and desktop widths.

## Task 8: Implement consent-first Analytics and factual privacy controls (`AUD-014`)

**Files:** `src/components/analytics/**` (new), `src/lib/analytics/consent.ts` and tests (new), `src/app/layout.tsx`, localized content/types, `src/app/privacy/page.tsx` (new), `src/app/[lang]/privacy/page.tsx` (new), footer, Analytics/privacy E2E, CSP tests, docs.

1. Write failing component/E2E tests proving no GA script/request exists before consent, reject remains silent, accept loads once, persistence works, withdrawal stops future collection, and policy-version changes re-prompt.
2. Implement a versioned first-party preference with default denial and an accessible localized banner/preferences dialog.
3. Load Analytics only after explicit consent and initialize Analytics-only consent signals; never enable advertising storage/signals.
4. Add a persistent footer control and factual Turkish/English privacy pages describing actual code behavior and owner-review questions.
5. Update CSP connect/script rules narrowly for consented GA endpoints and verify nonced inline behavior.
6. Run unit, CSP, privacy route, and mocked network E2E tests.

## Task 9: Reconcile locale, SEO, social, PWA, and content sources (`AUD-020`, remaining `AUD-001`)

**Files:** locale/content/types/routing, route metadata, sitemap/robots, structured data/social preview tests, `public/manifest.json`, docs.

1. Add failing tests for public locale inventory, `/`, `/en/`, `/tr/`, unsupported locale metadata/404, canonical/hreflang, sitemap, structured data, manifest assets, and social images.
2. Narrow `PortfolioLocale` and all records to `tr | en`; remove Spanish content/translations/tests only after import proof.
3. Prevent invalid locale metadata from falling back to Turkish/English canonical output.
4. Centralize locale/site URL generation and align every SEO/social surface.
5. Replace stale numeric experience claims in global/PWA metadata with stable role language; preserve dated timeline content and flag factual owner inputs rather than inventing replacements.
6. Make manifest language, colors, shortcuts, and icon declarations match actual routes/assets.
7. Run SEO/i18n/unit tests and local production header/body probes.

## Task 10: Remove proven-dead parallel UI and reconcile documentation (`AUD-012`, `AUD-013`)

**Files:** legacy `src/components/pages`, `layout`, `theme`, `ui`, obsolete utils/data/i18n translations and barrels; active barrels; `README.md`, `CONTACT_SETUP.md`, `SECURITY_GUIDE.md`, `GOOGLE_ANALYTICS_INTEGRATION.md`.

1. Generate an import graph/reachability list from all App Router, test, script, and config roots.
2. Add/strengthen repository-convention tests that fail when forbidden legacy entry points are imported or documented as active.
3. Delete only files with no maintained root reachability; update barrels and tests after each coherent subtree.
4. Re-run type-check/tests after each removal batch to catch dynamic/barrel usage.
5. Rewrite docs to match actual scripts, environment precedence, privacy/Analytics, CSRF, Redis failure behavior, health semantics, deployment, supported locales, and safe contact testing.
6. Keep the original audit unchanged and add a remediation ledger rather than rewriting historical findings.

## Task 11: Upgrade affected dependencies in isolated batches (`AUD-002`)

**Files:** `package.json`, `package-lock.json`, coupled config/source only when upstream compatibility requires it.

1. Refresh `npm outdated`, `npm audit --json`, and `npm audit --omit=dev --json`; retrieve official advisories/release notes for material runtime changes.
2. Batch A: compatible development/coverage/a11y patch-minor updates; run focused gates.
3. Batch B: Nodemailer fixed version; run contact/email/health tests and production build.
4. Batch C: aligned Next/React/ESLint packages at the complete advisory fix point; run proxy/CSP/metadata/browser gates.
5. Batch D: remaining safe transitive fixes without `--force`; document residual dev-only advisories and reachability.
6. After every batch run `npm ci` integrity check (without retaining a rewritten tree from a failed experiment), lint, type-check, tests, coverage, and build as proportional to risk.

## Task 12: Full verification, GA4 configuration, and remediation ledger

**Files:** `docs/audits/2026-07-15-comprehensive-project-remediation.md` (new); GA4/Search Console external configuration (recorded, not represented as repository code).

1. Run fresh `git status --short --branch` and confirm no unrelated content changed.
2. Execute and record exact exit code/duration/classification for lint, type-check, both env validations, unit, coverage, build, E2E, full audit, and production-only audit.
3. Start the local production app and test route/status/metadata/API matrices without sending email.
4. Run browser QA at 360x800, 768x1024, and 1440x900 in both locales/themes, including keyboard navigation, reduced motion, consent, projects, form validation, 404, console, network, and hydration.
5. Passively re-check the canonical public site; distinguish undeployed source fixes from production state.
6. In GA4, record before-state, then apply the already disclosed reversible privacy settings: query-parameter redaction; disable unused site-search/video/form enhanced events; minimize retention/reset; keep Signals/user-provided data off; link Search Console. Leave Internal Traffic in Testing until post-deployment validation proves it safe to activate.
7. Verify no secret values appear in logs, artifacts, diffs, or reports.
8. Write a finding-by-finding ledger with `Fixed`, `Partially fixed`, or `Blocked`, exact evidence, and remaining owner/deployment prerequisites.
9. Run final `git status --short --branch`; verify nothing is staged/committed/pushed and list every intentional changed/new/deleted file.

## Global verification matrix

Run after any task that changes a shared boundary, and always at the end:

```bash
npm run lint
npm run type-check
npm run validate:env
npm run validate:env:production
npm run test:run
npm run test:coverage
npm run build
npm run e2e
npm audit --json
npm audit --omit=dev --json
```

Failures do not stop independent work. Retry once only for evidence of a transient failure. Never convert a missing browser, missing local secret, network restriction, or undeployed production state into a passing claim.
