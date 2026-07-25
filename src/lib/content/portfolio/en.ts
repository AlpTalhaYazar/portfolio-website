import type { PortfolioContent } from "@/types/portfolio";

export const portfolioContentEn: PortfolioContent = {
  locale: "en",
  metadata: {
    title: "Alp Talha Yazar | Senior Backend Engineer",
    description:
      "Senior Backend Engineer building reliable enterprise systems, APIs, and distributed platforms for real production environments.",
  },
  nav: {
    homeLabel: "ATY",
    items: [
      { label: "Projects", href: "#projects" },
      { label: "Experience", href: "#experience" },
      { label: "About", href: "#about" },
      { label: "Contact", href: "#contact" },
    ],
    languageLabel: "Language",
    letsTalkLabel: "Let's Talk",
    closeMenuLabel: "Close navigation",
    openMenuLabel: "Open navigation",
    primaryNavLabel: "Primary navigation",
    mobileNavLabel: "Mobile navigation",
    footerNavLabel: "Footer navigation",
  },
  hero: {
    eyebrow: "SENIOR BACKEND ENGINEER",
    availability: "AVAILABLE FOR REMOTE BACKEND ROLES",
    headline: "I build backend systems that stay reliable under real load.",
    supportingText:
      "Architecture, reliability, and delivery ownership for enterprise software in production.",
    primaryCta: "View Selected Work",
    secondaryCta: "Start a Conversation",
    techTags: [
      ".NET 9",
      "C#",
      "ASP.NET Core",
      "PostgreSQL",
      "RabbitMQ / MassTransit",
      "Redis",
      "Docker",
    ],
  },
  about: {
    sectionNumber: "02",
    sectionTitle: "ABOUT",
    lead: "A software engineer who builds backend systems that hold up under real conditions.",
    paragraphs: [
      "I work on the parts of a product that have to stay dependable when the system gets busy: APIs, service boundaries, data flows, queues, deployments, and the operational decisions around them.",
      "My strongest work has been in enterprise B2B and B2G software, AI infrastructure, and platform-style systems where correctness, maintainability, and observability matter as much as shipping features.",
      "I build primarily with .NET and C#, work comfortably with PostgreSQL, Redis, RabbitMQ/MassTransit, and Docker, and can move into adjacent layers when product delivery needs someone who understands both implementation and architecture.",
    ],
    statusPill: "Based in Türkiye · Open to remote backend opportunities",
  },
  experience: {
    sectionNumber: "03",
    sectionTitle: "EXPERIENCE",
    intro:
      "I build systems that need to keep operating under real production constraints, with a focus on architecture, reliability, and operational clarity.",
    items: [
      {
        number: "01",
        company: "DİAS Teknoloji",
        role: "Software Developer",
        period: "2025 - Present",
        location: "Istanbul, Türkiye",
        description:
          "Own end-to-end backend delivery for regulated B2G platforms, translating business requirements into maintainable services and workflows. Work across API and domain design, authorization boundaries, asynchronous processing, automated testing, observability, release readiness, and production troubleshooting.",
        tags: [
          ".NET 9/10",
          "C#",
          "Entity Framework Core",
          "PostgreSQL",
          "Redis",
          "RabbitMQ / MassTransit",
          "Docker",
          "Keycloak",
          "HashiCorp Vault",
        ],
      },
      {
        number: "02",
        company: "Wiro AI",
        role: "Software Engineer",
        period: "2023 - 2025",
        location: "Istanbul, Türkiye",
        description:
          "Built backend and platform capabilities for AI/ML infrastructure spanning model testing, request routing, worker-based processing, asynchronous workflows, GPU-enabled Linux environments, internal Blazor tooling, and real-time operational visibility.",
        tags: [
          ".NET 6/8",
          "C#",
          "Blazor",
          "PostgreSQL",
          "Redis",
          "SignalR",
          "Docker",
          "Linux",
        ],
      },
      {
        number: "03",
        company: "Jetlink",
        role: "Software Engineer",
        period: "2021 - 2023",
        location: "Istanbul, Türkiye",
        description:
          "Developed APIs, integrations, reporting flows, and real-time communication for a multi-surface chatbot platform. Modernized legacy .NET components and supported database changes, Windows/IIS deployments, and production troubleshooting.",
        tags: [
          ".NET Framework/Core",
          "C#",
          "MongoDB",
          "SQL Server",
          "WebSockets",
          "React",
          "IIS",
        ],
      },
    ],
  },
  projects: {
    sectionNumber: "04",
    sectionTitle: "SELECTED WORK",
    intro: "Systems built in production, not in demos.",
    expandLabel: "Inspect technical brief",
    collapseLabel: "Close technical brief",
    inspectionEyebrow: "Technical dossier",
    inspectionHint: "Layered implementation notes and architecture context.",
    inspectionActiveLabel: "Inspection active",
    previewLabels: {
      context: "Context",
      focus: "Focus",
      stack: "Stack",
    },
    summaryTitle: "Why it mattered",
    responsibilitiesTitle: "What I worked on",
    footprintTitle: "Technical footprint",
    items: [
      {
        number: "01",
        name: "Regulated Monitoring & Management Platform",
        company: "DİAS Teknoloji",
        contextLabel: "Monitoring, operational data flows, and reporting",
        description:
          "Backend platform for regulated operations where monitoring, reporting, asynchronous processing, and production visibility need to remain dependable under real operational constraints.",
        themes: [
          "Real-time monitoring",
          "Message-driven workflows",
          "Operational reliability",
        ],
        tags: [
          ".NET 9/10",
          "C#",
          "PostgreSQL",
          "RabbitMQ / MassTransit",
          "Redis",
          "Docker",
        ],
        details: {
          badgeLabel: "Generalized brief",
          note: "Program and institution-specific details are intentionally generalized; the brief focuses only on public-safe engineering scope.",
          summary:
            "The engineering challenge was to keep operational data flows, background processing, reporting, and runtime visibility reliable while preserving clear service boundaries and maintainable production behavior.",
          responsibilities: [
            "Built and evolved backend services for monitoring, operational workflows, and reporting.",
            "Implemented message-driven coordination and background processing across service boundaries.",
            "Worked on data access, runtime visibility, automated tests, and production troubleshooting.",
            "Followed features from requirement clarification through release readiness and post-release support.",
          ],
          footprint: [
            ".NET 9/10 services and REST APIs",
            "RabbitMQ / MassTransit messaging and background workflows",
            "PostgreSQL and Redis-backed application behavior",
            "Docker-based delivery and environment consistency",
            "Automated testing and production observability",
          ],
        },
      },
      {
        number: "02",
        name: "Regulated Asset Tracking Platform",
        company: "DİAS Teknoloji",
        contextLabel: "Domain modeling, authorization, traceability, and reporting",
        description:
          "Backend platform for regulated asset and workflow tracking, with a focus on reliable persistence, authorization boundaries, auditability, and reporting-ready data flows.",
        themes: [
          "Regulated workflows",
          "Authorization boundaries",
          "Reporting and traceability",
        ],
        tags: [
          ".NET 9/10",
          "Entity Framework Core",
          "PostgreSQL",
          "Redis",
          "Docker",
          "REST APIs",
        ],
        details: {
          badgeLabel: "Generalized brief",
          note: "Program and institution-specific details are intentionally generalized; the brief focuses only on public-safe engineering scope.",
          summary:
            "The backend needed clear domain boundaries, dependable authorization, consistent historical visibility, and reporting-oriented data behavior without exposing operational complexity to API consumers.",
          responsibilities: [
            "Modeled backend workflows and persistence boundaries for regulated tracking scenarios.",
            "Implemented authorization-aware service behavior and reporting-ready data flows.",
            "Worked on query behavior, validation, automated tests, and operational reliability.",
            "Collaborated with business stakeholders to turn requirements into maintainable APIs and domain behavior.",
          ],
          footprint: [
            ".NET 9/10 REST APIs and domain services",
            "Entity Framework Core with PostgreSQL",
            "Redis-backed caching and runtime coordination",
            "Authorization and auditability-oriented service boundaries",
            "Docker-based delivery and automated verification",
          ],
        },
      },
      {
        number: "03",
        name: "Regulated Workflow & Verification Platform",
        company: "DİAS Teknoloji",
        contextLabel: "Business discovery, secure APIs, and audit-ready workflows",
        description:
          "Backend platform for regulated workflows where domain clarity, secure verification behavior, authorization, auditability, and release confidence are central engineering concerns.",
        themes: [
          "Domain-driven workflows",
          "Secure verification",
          "End-to-end delivery ownership",
        ],
        tags: [
          ".NET 9/10",
          "C#",
          "Entity Framework Core",
          "PostgreSQL",
          "Keycloak",
          "Docker",
          "REST APIs",
        ],
        details: {
          badgeLabel: "Generalized brief",
          note: "Program and institution-specific details are intentionally generalized; the brief focuses only on public-safe engineering scope.",
          summary:
            "This workstream requires end-to-end ownership from business discovery and domain modeling through API design, authorization, automated verification, release readiness, and production support.",
          responsibilities: [
            "Worked directly with business stakeholders to clarify requirements and domain boundaries.",
            "Designed APIs, authorization behavior, and persistence rules for regulated workflows.",
            "Built automated tests around domain, application, and API contracts.",
            "Followed delivery through review, release preparation, and production-facing support.",
          ],
          footprint: [
            ".NET 9/10 application and API boundaries",
            "Entity Framework Core with PostgreSQL persistence",
            "Keycloak-backed identity and authorization integration",
            "Automated domain, application, and API tests",
            "Docker-based environments and release readiness",
          ],
        },
      },
      {
        number: "04",
        name: "Wiro AI Infrastructure Platform",
        company: "Wiro AI",
        contextLabel: "GPU workers, model testing, and request routing",
        description:
          "AI/ML infrastructure platform combining worker processing, request coordination, model-testing surfaces, internal operations tooling, and real-time visibility for GPU-enabled Linux environments.",
        themes: [
          "Worker processing",
          "Request coordination",
          "Real-time operational visibility",
        ],
        tags: [
          ".NET 6/8",
          "C#",
          "Blazor",
          "PostgreSQL",
          "Redis",
          "SignalR",
          "Docker",
          "Linux",
        ],
        details: {
          summary:
            "Wiro combined worker processing and request coordination with model-testing surfaces, internal operational tooling, and real-time visibility across GPU-enabled Linux environments.",
          responsibilities: [
            "Built and supported worker services running in GPU-enabled Linux environments.",
            "Developed backend services for request routing, coordination, and API access.",
            "Contributed to internal Blazor tooling used to test and operate platform capabilities.",
            "Implemented real-time monitoring and operational feedback for runtime behavior.",
          ],
          footprint: [
            ".NET services spanning workers, coordination, and API surfaces",
            "PostgreSQL and Redis for runtime state and application data",
            "SignalR-powered real-time platform visibility",
            "Dockerized Linux runtime for GPU-enabled workloads",
            "Blazor tooling as an internal operational surface",
          ],
        },
      },
      {
        number: "05",
        name: "Jetlink Chatbot Platform",
        company: "Jetlink",
        contextLabel: "CMS, APIs, chatbot surfaces, and integrations",
        description:
          "Multi-surface chatbot platform spanning APIs, integrations, management tooling, reporting, end-user messaging, and real-time communication across production environments.",
        themes: [
          "Omnichannel chatbot platform",
          "Legacy modernization",
          "Real-time integrations",
        ],
        tags: [".NET 6", "MongoDB", "WebSockets", "React", "TypeScript", "IIS"],
        details: {
          summary:
            "Jetlink was not a single interface but a connected platform: CMS tooling, internal and external APIs, embeddable chatbot surfaces, reporting flows, and social/channel integrations. A major part of the engineering value came from modernizing legacy .NET 4.7 pieces into a more maintainable .NET 6-oriented architecture while keeping the platform usable.",
          responsibilities: [
            "Worked across CMS, API, reporting, and end-user chatbot surfaces rather than a single isolated application.",
            "Implemented and maintained internal and external REST integrations, including webhook-style and channel-facing communication flows.",
            "Contributed to real-time messaging behavior and end-user interaction layers using WebSockets and web-facing UI components.",
            "Supported the migration path from legacy .NET 4.7 components toward a more modern .NET 6 architecture without losing platform continuity.",
          ],
          footprint: [
            "ASP.NET MVC + React-based management surfaces and hybrid UI flows",
            "REST APIs and webhook integration points for platform connectivity",
            "MongoDB-backed application data across chatbot and reporting surfaces",
            "WebSocket-driven real-time communication behavior",
            "Windows Server and IIS deployment model for multi-environment delivery",
            "Third-party and channel integrations across internal and public API boundaries",
          ],
        },
      },
      {
        number: "06",
        name: "ScopePoker Real-time Estimation Platform",
        company: "Personal Project",
        contextLabel: "Real-time sessions, backend APIs, and independent delivery",
        description:
          "Real-time Scrum estimation product demonstrating independent ownership across backend APIs, session behavior, WebSocket communication, persistence, caching, shared contracts, and deployment.",
        themes: [
          "Real-time collaboration",
          "Secure session flows",
          "Independent product ownership",
        ],
        tags: [
          "TypeScript",
          "Fastify",
          "WebSockets",
          "PostgreSQL",
          "Redis",
          "Prisma",
          "Docker",
          "React",
        ],
        details: {
          badgeLabel: "Personal product",
          summary:
            "ScopePoker brings real-time estimation sessions, backend APIs, persistence, caching, and a type-safe web client into one independently delivered product. The case study focuses on backend behavior and operational ownership rather than UI tooling.",
          responsibilities: [
            "Designed backend APIs and shared type-safe contracts for estimation sessions.",
            "Implemented WebSocket-driven room behavior and secure access across session lifecycles.",
            "Modeled persistent data with Prisma and PostgreSQL and used Redis for runtime coordination.",
            "Owned containerized delivery, deployment setup, and production troubleshooting.",
          ],
          footprint: [
            "Fastify APIs and shared TypeScript contracts",
            "WebSocket-based real-time session communication",
            "Prisma with PostgreSQL persistence",
            "Redis-backed runtime coordination",
            "Dockerized backend and web delivery",
            "React product surface as an adjacent delivery layer",
          ],
        },
      },
    ],
  },
  capabilities: {
    sectionNumber: "05",
    sectionTitle: "CAPABILITIES",
    groups: [
      {
        category: "Backend",
        items: [
          ".NET / C#",
          "ASP.NET Core APIs",
          "Entity Framework Core",
          "Domain-driven and clean architecture",
          "RabbitMQ / MassTransit",
          "SignalR",
        ],
      },
      {
        category: "Data",
        items: [
          "PostgreSQL",
          "Redis",
          "SQL Server",
          "MongoDB",
          "Data modeling",
          "Query performance",
        ],
      },
      {
        category: "Platform",
        items: [
          "Docker",
          "Linux",
          "CI/CD",
          "Observability",
          "Operational readiness",
          "Environment management",
        ],
      },
      {
        category: "Adjacent Delivery",
        items: [
          "TypeScript",
          "React",
          "Next.js",
          "Blazor",
          "UI integration",
          "End-to-end delivery",
        ],
      },
    ],
    callout:
      "My strongest edge is backend architecture and engineering judgment: building systems other engineers can extend, operate, and trust under pressure.",
    statLabel: "PRODUCTION SYSTEMS · ENGINEERING DEPTH",
  },
  contact: {
    sectionNumber: "06",
    sectionTitle: "CONTACT",
    headline: "Let's build something that matters.",
    intro:
      "Open to senior engineering roles, consulting engagements, and serious product collaborations.",
    body: "If you are building a product that needs reliable backend systems, clear technical ownership, and engineering decisions that hold up in production, let's talk.",
    form: {
      nameLabel: "Name",
      emailLabel: "Email",
      subjectLabel: "Subject",
      messageLabel: "Message",
      submitLabel: "Send Message",
      submittingLabel: "Sending...",
      placeholders: {
        name: "Your full name",
        email: "your@email.com",
        subject: "What are you building?",
        message:
          "Tell me about the role, product, or system you want to discuss.",
      },
      validation: {
        nameRequired: "Please enter your name.",
        emailInvalid: "Please enter a valid email address.",
        subjectRequired: "Please enter a subject.",
        messageRequired: "Please enter a message.",
        messageMinLength: "Message must be at least 10 characters.",
      },
      success: "Message received. I'll get back to you as soon as possible.",
      securityLoading: "Securing form...",
      secured: "Form secured",
      errors: {
        security: "Security validation failed. Please try again.",
        rateLimited:
          "Too many requests. Please wait {minutes} minutes before trying again.",
        unavailable:
          "The contact service is temporarily unavailable. Please try again later.",
        failed: "Failed to send message. Please try again.",
      },
    },
  },
  footer: {
    strapline: "Senior Backend Engineer · alptalha.dev",
    copyright: "All rights reserved.",
  },
  notFound: {
    eyebrow: "ERROR 404",
    title: "Route not found.",
    description:
      "The page you're looking for doesn't exist or has moved. At least the failure is handled cleanly.",
    primaryCta: "Back to Portfolio",
    secondaryCta: "Go Back",
  },
};
