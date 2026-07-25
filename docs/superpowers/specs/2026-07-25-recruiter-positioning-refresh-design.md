# Portfolio Recruiter Positioning Refresh Design

## Status

Approved direction: preserve the current visual system while aligning the bilingual portfolio with the owner's backend-focused CV, official role titles, public-safe project boundaries, and target Senior Backend Engineer / .NET Backend Engineer roles.

Approval date: 2026-07-25.

## Goals

- Position the owner clearly for Senior Backend Engineer and .NET Backend Engineer opportunities.
- Make the first scan useful to recruiters while retaining enough technical depth for engineering managers.
- Present six distinct project case studies without exposing program names, customers, institution-specific workflows, or private architecture details.
- Align role titles, experience summaries, technology claims, and project positioning with the updated CV.
- Preserve Turkish and English parity.
- Keep the existing editorial/technical visual identity, responsive behavior, accessibility, SEO, privacy, contact, and security architecture intact.

## Non-goals

- Do not redesign the page structure, theme, typography, navigation, contact flow, or project-card interaction model.
- Do not invent outcome metrics, scale claims, team sizes, seniority titles, or technologies.
- Do not publish internal program names, acronyms, customer names, internal entities, endpoint names, infrastructure topology, or unreleased workflows.
- Do not describe AI-assisted implementation choices for personal-project UI work. Public copy should describe the product and the engineering responsibility, not the tools used to draft it.
- Do not restore a ScopePoker live link until the deployment is healthy and verified.
- Do not push or deploy as part of the content implementation unless separately requested.

## Audience and message hierarchy

The portfolio serves two primary readers:

1. Recruiters need a fast answer to role fit, current level, location, availability, employers, and core stack.
2. Engineering managers need evidence of backend ownership, domain modeling, distributed workflows, authorization, operational reliability, testing, and production support.

The page should therefore communicate in this order:

1. Backend role and core stack in the hero.
2. Engineering focus and working style in About.
3. Official employment timeline and concise scope in Experience.
4. Six project case studies with progressively disclosed technical depth.
5. A focused capability matrix that reinforces backend specialization without hiding adjacent delivery experience.
6. A direct contact invitation for relevant roles and collaborations.

## Core positioning

The canonical positioning is:

- Public headline: **Senior Backend Engineer**.
- Role targets: Senior Backend Engineer and .NET Backend Engineer.
- Primary evidence: production-grade APIs, distributed workflows, regulated B2G systems, data-heavy services, real-time behavior, reliability, and end-to-end delivery ownership.
- Primary technologies: .NET, C#, ASP.NET Core, PostgreSQL, Redis, RabbitMQ/MassTransit, Entity Framework Core, SignalR, Docker, Keycloak, and HashiCorp Vault where supported by the relevant experience.
- Secondary fluency: TypeScript, React, Next.js, and Blazor as adjacent delivery capabilities rather than the center of the profile.

Kubernetes must not appear anywhere in public portfolio content.

## Experience section

### Current role

- Company label: `DİAS Teknoloji`.
- Official role: `Software Developer` / `Yazılım Geliştirme Uzmanı` according to locale.
- The description should emphasize end-to-end backend delivery for regulated B2G platforms, business-stakeholder collaboration, domain and API design, authorization boundaries, background/event-driven processing, testing, observability, release readiness, and production troubleshooting.
- The public stack may include .NET 9/10, C#, PostgreSQL, Entity Framework Core, RabbitMQ/MassTransit, Redis, Docker, Keycloak, and HashiCorp Vault.

### Wiro AI

- Keep the official `Software Engineer` title.
- Emphasize backend and platform capabilities for model testing, request routing, worker-based processing, asynchronous workflows, GPU-enabled Linux environments, internal Blazor tooling, and real-time operational visibility.
- Avoid copy that makes frontend or AI product branding the primary identity.

### Jetlink

- Use the `Software Engineer` title to match the CV and public professional profile.
- Emphasize APIs, integrations, reporting, real-time communication, legacy .NET modernization, database work, IIS deployment, and production troubleshooting.
- React and TypeScript remain supporting technologies rather than the headline.

The brief intermediate role intentionally omitted from the CV must remain omitted from the website.

## Selected Work architecture

Keep the current two-column project-card and expandable dossier interaction. Expand the content set from four to six cards so the grid remains visually balanced at desktop widths.

### Card 01 — Regulated Monitoring & Management Platform

- Represents one distinct current-role workstream without exposing its program identity.
- Public focus: reliable backend services for monitoring, operational data flows, reporting, asynchronous processing, and production visibility.
- Safe technical themes: real-time monitoring, message-driven workflows, operational reliability.
- Safe stack: .NET 9/10, C#, PostgreSQL, RabbitMQ/MassTransit, Redis, Docker.
- Exclude customer-specific operations, maintenance schedules, internal topology, and deployment-orchestration claims.

### Card 02 — Regulated Asset Tracking Platform

- Represents a second distinct current-role workstream without exposing its program identity.
- Public focus: domain modeling, asset and workflow tracking, authorization, auditability, reporting, and reliable persistence for regulated operations.
- Safe technical themes: regulated workflows, authorization boundaries, reporting and traceability.
- Safe stack: .NET 9/10, Entity Framework Core, PostgreSQL, Redis, Docker, REST APIs.
- Exclude tenant implementation details, internal state names, customer processes, and exact reporting obligations.

### Card 03 — Regulated Workflow & Verification Platform

- Represents a third distinct current-role workstream without exposing its program identity.
- Public focus: end-to-end backend ownership from business discovery through domain modeling, APIs, authorization, auditability, automated tests, and release readiness.
- Safe technical themes: domain-driven workflows, secure verification, audit-ready backend behavior.
- Safe stack: .NET 9/10, C#, Entity Framework Core, PostgreSQL, Keycloak, Docker, REST APIs.
- Exclude internal domain nouns, resource names, route shapes, verification rules, organization structures, and configuration details.

### Card 04 — Wiro AI Infrastructure Platform

- Preserve it as prior professional platform experience.
- Focus on worker processing, APIs, request coordination, asynchronous behavior, Linux execution, internal operations tooling, and real-time visibility.
- Keep the existing expandable technical depth after tightening repetition.

### Card 05 — Jetlink Chatbot Platform

- Preserve it as prior professional product-platform experience.
- Focus on APIs, integrations, reporting, real-time messaging, modernization, and production operations.
- Keep channel names and customer examples out unless they are already independently public and materially useful.

### Card 06 — ScopePoker Real-time Estimation Platform

- Present it as a personal product demonstrating independent ownership.
- Focus on real-time session behavior, backend APIs, WebSocket communication, PostgreSQL, Redis, secure session flows, shared type-safe contracts, Docker, and deployment responsibility.
- React may appear as a supporting surface; backend and system ownership remain the center of the case study.
- Do not mention AI-assisted UI work.
- Do not publish a live URL until the deployment is healthy and verified.

## Confidentiality contract

Every current-role project card must carry a localized disclosure explaining that program and institution-specific details are intentionally generalized.

Allowed public information:

- Regulated B2G context.
- Generic engineering responsibilities personally performed by the owner.
- Broad, externally common technologies that the owner can confidently discuss.
- General reliability, auditability, authorization, testing, and operational concerns.

Disallowed public information:

- Internal program names or acronyms, including in source comments, tests, fixtures, and documentation.
- Customer, institution, organization, or vendor identities that are not already intentionally public in this portfolio.
- Internal entity names, endpoint paths, permission identifiers, workflow states, configuration keys, seed data, topology, or deployment details.
- Exact traffic, transaction, asset, user, or financial volumes without independently verifiable public evidence and owner approval.
- Claims that imply ownership of an entire public government program.

The implementation should fail review if sensitive identifiers are moved from visible copy into comments, test names, fixtures, or design documentation.

## Hero and About copy

- Retain the `Senior Backend Engineer` headline and production-reliability theme.
- Replace Kubernetes in hero tags and About copy with stronger evidence already supported by the work, such as RabbitMQ/MassTransit or Entity Framework Core.
- Keep numeric years out of evergreen website summary copy; the dated Experience section remains the evidence source.
- Keep the location/availability statement concise: based in Türkiye and open to relevant remote backend opportunities.
- Avoid broad claims such as being comfortable with every layer of the stack. State that adjacent layers can be handled when product delivery requires it.

## Capability matrix

Retain four groups but sharpen their hierarchy:

### Backend

- .NET / C#
- ASP.NET Core APIs
- Entity Framework Core
- Domain-driven and clean architecture
- RabbitMQ / MassTransit
- SignalR

### Data

- PostgreSQL
- Redis
- SQL Server
- MongoDB
- Data modeling
- Query performance

### Platform

- Docker
- Linux
- CI/CD
- Observability
- Operational readiness
- Environment management

### Adjacent Delivery

- TypeScript
- React
- Next.js
- Blazor
- UI integration
- End-to-end delivery

This final group demonstrates delivery range without presenting frontend work as the primary specialization.

## Localization and SEO

- Update Turkish and English content together in the same change.
- Preserve route structure, canonicals, hreflang, sitemap, social metadata, and structured data.
- Keep titles centered on `Senior Backend Engineer`.
- Ensure metadata descriptions reflect backend systems, APIs, regulated platforms, and production reliability without unsupported metrics.
- Use natural language in each locale rather than direct word-for-word translation.

## Component and data-flow impact

The existing content-driven architecture remains the source of truth:

- `src/lib/content/portfolio/en.ts` and `tr.ts` contain localized copy.
- `PortfolioPage` continues to compose existing sections.
- `Experience`, `Projects`, and `Capabilities` continue to render typed content without embedded career claims.
- The project type may be extended only if ScopePoker needs an optional repository or future verified live-link field. No link is required for the initial implementation.
- No API, contact, analytics, privacy, theme, or security data flow changes are expected.

## Testing and verification

Add or update focused tests to protect the new contract:

- Turkish and English locales each expose exactly six project cards in the approved order.
- The current employer uses the official localized role title.
- Public content contains no Kubernetes claim.
- Every current-role project uses a generalized public title and disclosure note.
- Wiro, Jetlink, and ScopePoker content retain their intended employer/personal labels.
- ScopePoker has no live-link claim in the initial implementation.
- Existing hero, project interaction, responsive grid, accessibility, locale, metadata, and contact tests remain green.
- Do not encode sensitive internal identifiers in tests merely to assert that they are absent.

Verification sequence:

1. Run focused content and portfolio-component tests.
2. Run lint and TypeScript checks.
3. Run the complete unit/integration suite.
4. Run a production build only through the repository's existing secret-safe environment contract; do not inspect or print secret-bearing files.
5. Inspect Turkish and English pages at mobile, tablet, and desktop widths in light and dark themes.
6. Confirm project dossiers remain keyboard-operable and that the six-card grid has no orphaned card at desktop widths.
7. Re-run `git status --short --branch` and review the final diff before committing.

## Commit and delivery strategy

- Commit this approved design as a standalone documentation commit.
- After owner review, create a detailed implementation plan before editing application code.
- Implement content, tests, and any minimal type/component adjustments in reviewable commits.
- Do not push or deploy unless separately requested.

## Completion criteria

- The portfolio presents a coherent backend-first story aligned with the CV.
- The three current-role workstreams remain distinct without disclosing their identities or internal details.
- Six project cards render in both locales and form a balanced desktop grid.
- Kubernetes is absent from public portfolio content.
- Role titles match the approved public profile.
- ScopePoker demonstrates independent backend ownership without an unverified live link or AI-centered framing.
- Focused and full quality gates pass, or any environment-dependent blocker is reported precisely.
