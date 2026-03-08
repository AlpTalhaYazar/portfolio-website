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
        period: "2023 - Present",
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
        period: "Jul 2023 - Aug 2024",
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
        period: "2021 - 2022",
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
    items: [
      {
        number: "01",
        name: "Enterprise Management Platform",
        company: "Dias (Atlastek)",
        description:
          "Real-time operational monitoring and tracking for enterprise clients in regulated sectors, built around high uptime, large-scale event flows, and service-to-service coordination.",
        themes: [
          "Operational reliability",
          "Real-time monitoring",
          "Large-scale data flows",
        ],
        tags: [
          ".NET 9",
          "PostgreSQL",
          "Redis",
          "RabbitMQ",
          "Docker",
          "Kubernetes",
        ],
      },
      {
        number: "02",
        name: "Enterprise Asset Tracking System",
        company: "Dias (Atlastek)",
        description:
          "Multi-tenant asset tracking and reporting system for compliance-heavy environments where auditability, domain clarity, and stable backend contracts mattered.",
        themes: [
          "Regulated environments",
          "Multi-tenant architecture",
          "Reporting and compliance",
        ],
        tags: [".NET 9", "C#", "Entity Framework Core", "PostgreSQL", "Docker"],
      },
      {
        number: "03",
        name: "Wiro AI ML Infrastructure Platform",
        company: "Wiro AI",
        description:
          "Infrastructure platform for AI/ML operations: GPU workers, request distribution, model-testing workflows, and live monitoring, built to make internal systems more observable and operable.",
        themes: [
          "GPU worker orchestration",
          "Request distribution",
          "System visibility",
        ],
        tags: [".NET 8", "Redis", "PostgreSQL", "Docker", "Linux", "SignalR"],
      },
      {
        number: "04",
        name: "Jetlink Multi-Project Chatbot Platform",
        company: "Jetlink",
        description:
          "Full-stack chatbot platform spanning CMS, APIs, reporting, integrations, and end-user UI, including a legacy .NET modernization path and real-time communication workflows.",
        themes: [
          "Platform architecture",
          "Legacy modernization",
          "Integration-heavy systems",
        ],
        tags: [".NET 6", "MongoDB", "WebSockets", "React", "TypeScript", "IIS"],
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
