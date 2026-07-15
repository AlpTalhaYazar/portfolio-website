# Google Analytics and Consent

This document describes the portfolio's current Google Analytics 4 integration and the separate GA property settings an operator must maintain.

## Privacy model

Analytics is optional and disabled by default.

- The GA component is not mounted before an explicit acceptance.
- Rejection sends no Analytics script request.
- Acceptance grants `analytics_storage` only.
- `ad_storage`, `ad_user_data`, and `ad_personalization` remain denied.
- Withdrawing consent unmounts Analytics, records a rejection, and sets the GA disable flag for the measurement ID.
- A changed consent-policy version causes the site to ask again instead of silently reusing an old decision.

The application does not claim that these controls alone satisfy every privacy regime. The owner must review the deployed behavior, privacy notice, mailbox practices, GA property configuration, and applicable requirements.

## Configuration

Set the optional public variable:

```dotenv
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

A GA measurement ID is public by design; it is not an authentication secret. If the variable is absent, analytics preference controls are not rendered and the GA component is never mounted.

The value must match the GA4 `G-` format accepted by environment validation.

## Browser behavior

After hydration, the consent provider reads `aty-analytics-consent` from local storage. The stored object contains only:

- consent policy version
- `accepted` or `rejected`
- update timestamp

Malformed, unavailable, or stale storage is treated as no valid decision. If browser storage is blocked, the in-memory decision still controls the current page but may not survive a reload.

The first-time prompt is a non-modal region so visitors can continue reading before choosing. The footer and privacy page reopen a modal preferences panel with trapped focus, Escape handling, background inertness, and focus restoration.

## Data minimization

Application code does not enable advertising signals, ad personalization, user-provided data collection, or custom event tracking. The localized privacy pages describe the currently implemented data flow and provide a persistent preference entry point.

GA property settings exist outside this repository and can override or expand collection behavior. Keep the property aligned with the application:

- Google Signals and user-provided data collection: off
- advertising personalization: off
- query-parameter redaction: configured for sensitive parameters used by the site or future campaigns
- enhanced measurement: enable only events that have an explicit product purpose
- retention: choose the shortest period that supports the documented purpose
- internal/developer traffic filters: validate before activating
- Search Console link: optional, but useful for privacy-reviewed organic-search analysis

Record any change to collection purpose, storage, retention, or sharing in the privacy notice and consent policy version.

## Verification

### Automated

```bash
npm run test:run -- src/components/analytics/AnalyticsConsentProvider.test.tsx
npm run e2e
```

The tests verify no load before consent, rejection persistence, analytics-only consent, withdrawal, policy-version re-prompting, modal keyboard behavior, and absence of GA network requests after rejection. E2E intercepts Google endpoints so local verification never sends analytics data.

### Manual local check

1. open a fresh browser context with local storage cleared
2. load Turkish and English routes
3. confirm no request to Google Analytics or Tag Manager before choosing
4. reject and reload; confirm the script remains absent
5. reopen preferences from the footer; verify keyboard containment, Escape, and restored focus
6. accept; confirm one GA integration is mounted and advertising consent remains denied
7. withdraw from preferences and confirm new collection stops

Use browser developer tools to inspect network destinations and console errors. Do not infer consent behavior from the presence of a banner alone.

### Production check

Use a synthetic, consented browser session and GA DebugView or Realtime only after deployment approval. Do not submit the production contact form. Verify that:

- the deployed measurement ID is the intended property
- consent is denied before choice
- only the documented events appear
- query strings do not expose form or personal data
- the privacy page and preferences control are reachable in both locales

## Change rules

Treat any of the following as a privacy-sensitive change:

- adding a custom event, user property, advertising feature, or new Google destination
- collecting full URLs with new query parameters
- changing storage, retention, consent defaults, or policy version
- loading analytics before interaction
- adding another analytics or session-replay provider

Such changes require code tests, browser/network verification, updated privacy copy, and owner/compliance review before deployment.
