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
  },
  hero: {
    eyebrow: "SENIOR BACKEND ENGINEER",
    availability: "AVAILABLE FOR REMOTE WORK",
    headline: "I build backend systems that stay reliable under real load.",
    supportingText:
      "Architecture, reliability, and scale for enterprise software in production.",
    primaryCta: "View Selected Work",
    secondaryCta: "Start a Conversation",
    techTags: [
      ".NET 9",
      "C#",
      "ASP.NET Core",
      "Microservices",
      "PostgreSQL",
      "Redis",
      "Docker",
      "Kubernetes",
    ],
  },
  about: {
    sectionNumber: "02",
    sectionTitle: "ABOUT",
    lead: "A software engineer who builds backend systems that hold up under real conditions.",
    paragraphs: [
      "I work on the parts of a product that have to stay dependable when the system gets busy: APIs, service boundaries, data flows, queues, deployments, and the operational decisions around them.",
      "My strongest work has been in enterprise B2B and B2G software, AI infrastructure, and platform-style systems where correctness, maintainability, and observability matter as much as shipping features.",
      "I build primarily with .NET and C#, work comfortably with PostgreSQL, Redis, Docker, and Kubernetes, and can move across the stack when a product needs someone who understands both delivery and architecture.",
    ],
    statusPill: "Based in Turkey · Open to remote opportunities",
  },
  experience: {
    sectionNumber: "03",
    sectionTitle: "EXPERIENCE",
    intro:
      "Four-plus years building systems that need to keep operating under real production constraints.",
    items: [
      {
        number: "01",
        company: "Dias (Atlastek)",
        role: "Software Engineer",
        period: "2025 - Present",
        location: "Turkey",
        description:
          "Building enterprise-level B2G tracking and management systems for regulated environments. Focused on service reliability, data-heavy workflows, operational visibility, and backend architecture across a distributed production stack.",
        tags: [
          ".NET 9",
          "C#",
          "Entity Framework Core",
          "PostgreSQL",
          "Redis",
          "RabbitMQ",
          "Docker",
          "Kubernetes",
        ],
      },
      {
        number: "02",
        company: "Wiro AI",
        role: "Software Engineer",
        period: "2023 - 2025",
        location: "Istanbul, Turkey",
        description:
          "Built AI/ML infrastructure spanning Linux GPU workers, model-testing interfaces, LLM request distribution, APIs, and live monitoring. Worked close to orchestration, internal tooling, and systems that needed clear operational visibility.",
        tags: [
          ".NET 8",
          "Blazor",
          "PostgreSQL",
          "Redis",
          "Docker",
          "Linux",
          "SignalR",
          "Tailwind CSS",
        ],
      },
      {
        number: "03",
        company: "Jetlink",
        role: "Full Stack Developer",
        period: "2021 - 2023",
        location: "Turkey",
        description:
          "Delivered a multi-project chatbot platform covering CMS, REST APIs, end-user UI, reporting, and integrations. Led legacy-to-modern migration work and shipped across both backend-heavy and product-facing layers.",
        tags: [
          ".NET 6",
          "ASP.NET MVC",
          "MongoDB",
          "WebSockets",
          "React",
          "TypeScript",
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
        name: "Enterprise Management Platform",
        company: "Dias (Atlastek)",
        contextLabel: "Real-time monitoring, tracking, and analytics",
        description:
          "Enterprise management platform for large-scale operations where tracking, diagnostics, analytics, and scheduled maintenance had to remain reliable across distributed backend services.",
        themes: [
          "Real-time monitoring",
          "Analytics and diagnostics",
          "Operational scheduling",
        ],
        tags: [
          ".NET 9",
          "MassTransit",
          "PostgreSQL",
          "Kubernetes",
          "Helm",
          "Microservices",
        ],
        details: {
          badgeLabel: "Generalized brief",
          note: "Product naming is retained, while institution-specific workflows and process details remain intentionally generalized.",
          summary:
            "This platform concentrated several operational concerns into one production surface: live tracking, diagnostic visibility, reporting, and maintenance scheduling. The backend had to keep event-driven flows, analytics-ready data movement, and recurring operational tasks dependable without turning the system into a fragile tangle of services.",
          responsibilities: [
            "Worked on backend services supporting live tracking, diagnostics, and operational reporting across large-scale workflows.",
            "Implemented message-driven service coordination and background processing for maintenance-oriented and time-based tasks.",
            "Contributed to analytics and monitoring capabilities used to surface operational health, usage patterns, and system behavior.",
            "Supported production-readiness concerns around service boundaries, deployment shape, and runtime observability.",
          ],
          footprint: [
            ".NET 9 microservices coordinated through message-driven flows",
            "MassTransit-based communication patterns between platform services",
            "PostgreSQL-backed operational and analytics-oriented persistence",
            "Kubernetes + Helm deployment topology for service orchestration",
            "Recurring processing for maintenance and scheduling workloads",
            "Diagnostics, tracking, and reporting surfaces tuned for production operations",
          ],
        },
      },
      {
        number: "02",
        name: "Enterprise Asset Tracking System",
        company: "Dias (Atlastek)",
        contextLabel: "Compliance reporting and regulated asset workflows",
        description:
          "Enterprise asset tracking system for regulated operations where production visibility, auditability, role-based access, and reporting had to remain dependable across tenant boundaries.",
        themes: [
          "Compliance-first tracking",
          "Multi-tenant access control",
          "Reporting and audit readiness",
        ],
        tags: [
          ".NET 9",
          "Entity Framework Core",
          "PostgreSQL",
          "Redis",
          "Docker",
          "REST APIs",
        ],
        details: {
          badgeLabel: "Generalized brief",
          note: "Product naming is retained, while institution-specific workflows and process details remain intentionally generalized.",
          summary:
            "This system centered on tracking assets and operational movement in a regulated environment, with reporting and audit requirements shaping the backend as much as the core workflows. The work combined multi-tenant boundaries, role-based access, reporting pipelines, and scalable service behavior.",
          responsibilities: [
            "Built backend flows supporting production and distribution tracking with tenant-aware access boundaries.",
            "Worked on compliance-oriented reporting, auditability, and workflow states that needed consistent historical visibility.",
            "Helped implement role-based access patterns and service behavior suitable for multi-tenant enterprise usage.",
            "Contributed to analytics and reporting surfaces that translated operational activity into regulator- and operator-friendly outputs.",
          ],
          footprint: [
            ".NET 9 service layer with REST APIs and background processing",
            "Entity Framework Core + PostgreSQL for transactional and reporting data",
            "Redis-backed caching and runtime coordination",
            "Role-based and tenant-aware backend access patterns",
            "Reporting and audit workflows shaped for regulated operations",
            "Dockerized service topology supporting scalable enterprise deployment",
          ],
        },
      },
      {
        number: "03",
        name: "Wiro AI ML Infrastructure Platform",
        company: "Wiro AI",
        contextLabel: "GPU workers, model testing, and request routing",
        description:
          "AI/ML infrastructure platform combining GPU workers, request distribution, model testing surfaces, and live monitoring to make model operations easier to run and observe.",
        themes: [
          "GPU worker orchestration",
          "Model testing surfaces",
          "Real-time system visibility",
        ],
        tags: [".NET 8", "Blazor", "PostgreSQL", "Redis", "Docker", "SignalR"],
        details: {
          summary:
            "Wiro brought together several connected product surfaces: worker execution on GPU-enabled Linux machines, request-routing services, model testing interfaces, and monitoring views. The value was not just inference execution, but making the whole workflow operable for engineers who needed visibility, control, and repeatable deployment paths.",
          responsibilities: [
            "Worked on GPU-oriented worker services running on Linux environments with NVIDIA-backed processing support.",
            "Built and supported controller-style services for request routing, coordination, and API-level access management.",
            "Contributed to Blazor-based internal product surfaces used by ML engineers for testing models and adjusting configuration.",
            "Implemented monitoring and operational feedback loops, including real-time updates for system status and runtime behavior.",
          ],
          footprint: [
            ".NET 8 services spanning workers, controllers, and API surfaces",
            "Blazor + Tailwind UI for model testing and operational configuration",
            "REST APIs with internal and external access boundaries",
            "PostgreSQL + Redis for runtime state and supporting application data",
            "SignalR-powered live monitoring for infrastructure visibility",
            "Dockerized Linux runtime designed around GPU-enabled workloads",
          ],
        },
      },
      {
        number: "04",
        name: "Jetlink Multi-Project Chatbot Platform",
        company: "Jetlink",
        contextLabel: "CMS, APIs, chatbot surfaces, and integrations",
        description:
          "Multi-surface chatbot platform spanning management tooling, APIs, end-user chatbot experiences, reporting, and real-time integrations across web and social channels.",
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
            "Integrations spanning web chat plus channels such as WhatsApp, Facebook, and Instagram",
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
          "ASP.NET Core",
          "REST API design",
          "Microservices",
          "Entity Framework Core",
          "SignalR",
        ],
      },
      {
        category: "Data",
        items: [
          "PostgreSQL",
          "Redis",
          "MongoDB",
          "SQL Server",
          "Data modeling",
          "Query performance",
        ],
      },
      {
        category: "Platform",
        items: [
          "Docker",
          "Kubernetes",
          "Linux",
          "CI/CD thinking",
          "Operational readiness",
          "Environment management",
        ],
      },
      {
        category: "Full Stack Fluency",
        items: [
          "React",
          "Next.js",
          "TypeScript",
          "Blazor",
          "Tailwind CSS",
          "End-to-end delivery",
        ],
      },
    ],
    callout:
      "My strongest edge is backend architecture and engineering judgment: building systems other engineers can extend, operate, and trust under pressure.",
    statLabel: "5+ YEARS · PRODUCTION SYSTEMS",
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
      blocked: "Temporarily blocked",
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
