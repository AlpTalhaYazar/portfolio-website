import type { PortfolioContent } from "@/types/portfolio";

export const portfolioContentEs: PortfolioContent = {
  locale: "es",
  metadata: {
    title: "Alp Talha Yazar | Senior Backend Engineer",
    description:
      "Senior Backend Engineer que construye sistemas empresariales fiables, APIs y plataformas distribuidas para entornos reales de producción.",
  },
  nav: {
    homeLabel: "ATY",
    items: [
      { label: "Proyectos", href: "#projects" },
      { label: "Experiencia", href: "#experience" },
      { label: "Sobre mí", href: "#about" },
      { label: "Contacto", href: "#contact" },
    ],
    languageLabel: "Idioma",
    letsTalkLabel: "Hablemos",
    closeMenuLabel: "Cerrar navegación",
    openMenuLabel: "Abrir navegación",
  },
  hero: {
    eyebrow: "SENIOR BACKEND ENGINEER",
    availability: "DISPONIBLE PARA TRABAJO REMOTO",
    headline: "Construyo sistemas backend que siguen siendo fiables bajo carga real.",
    supportingText:
      "Arquitectura, fiabilidad y escala para software empresarial en producción.",
    primaryCta: "Ver trabajo seleccionado",
    secondaryCta: "Iniciar conversación",
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
    sectionTitle: "SOBRE MÍ",
    lead: "Un ingeniero de software que construye sistemas backend que resisten en condiciones reales.",
    paragraphs: [
      "Trabajo en las capas de un producto que deben mantenerse sólidas cuando el sistema se exige: APIs, límites entre servicios, flujos de datos, colas, despliegues y las decisiones operativas alrededor de todo eso.",
      "Mi mejor trabajo ha estado en software empresarial B2B y B2G, infraestructura de IA y sistemas de plataforma donde la corrección, la mantenibilidad y la observabilidad importan tanto como entregar funcionalidades.",
      "Construyo principalmente con .NET y C#, me muevo con soltura en PostgreSQL, Redis, Docker y Kubernetes, y puedo recorrer el stack cuando el producto necesita a alguien que entienda tanto la entrega como la arquitectura.",
    ],
    statusPill: "Basado en Turquía · Abierto a oportunidades remotas",
  },
  experience: {
    sectionNumber: "03",
    sectionTitle: "EXPERIENCIA",
    intro:
      "Más de cuatro años construyendo sistemas que tienen que seguir operando bajo restricciones reales de producción.",
    items: [
      {
        number: "01",
        company: "Dias (Atlastek)",
        role: "Backend Developer",
        period: "2023 - Actualidad",
        location: "Turquía",
        description:
          "Desarrollo sistemas B2G de seguimiento y gestión para entornos regulados. Enfoque en fiabilidad de servicios, flujos de datos intensivos y visibilidad operativa sobre una plataforma distribuida en producción.",
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
        period: "Jul 2023 - Ago 2024",
        location: "Estambul, Turquía",
        description:
          "Construí infraestructura de IA/ML con workers GPU en Linux, interfaces de prueba de modelos, distribución de peticiones LLM, APIs y monitorización en vivo. Trabajé muy cerca de la orquestación y la visibilidad operativa.",
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
        location: "Turquía",
        description:
          "Entregué una plataforma de chatbot de múltiples proyectos con CMS, APIs REST, UI para usuario final, reporting e integraciones. Lideré trabajo de modernización legacy y entregas tanto backend como de cara al producto.",
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
    sectionTitle: "TRABAJO SELECCIONADO",
    intro: "Sistemas construidos en producción, no en demos.",
    items: [
      {
        number: "01",
        name: "Enterprise Management Platform",
        company: "Dias (Atlastek)",
        description:
          "Monitorización y seguimiento operativo en tiempo real para clientes empresariales de sectores regulados, construido alrededor de alta disponibilidad, grandes flujos de eventos y coordinación entre servicios.",
        themes: [
          "Fiabilidad operativa",
          "Monitorización en tiempo real",
          "Flujos de datos a gran escala",
        ],
        tags: [".NET 9", "PostgreSQL", "Redis", "RabbitMQ", "Docker", "Kubernetes"],
      },
      {
        number: "02",
        name: "Enterprise Asset Tracking System",
        company: "Dias (Atlastek)",
        description:
          "Sistema multi-tenant de seguimiento de activos y reporting para entornos con alto nivel de cumplimiento, donde la auditabilidad, la claridad del dominio y los contratos backend estables fueron claves.",
        themes: [
          "Entornos regulados",
          "Arquitectura multi-tenant",
          "Reporting y cumplimiento",
        ],
        tags: [".NET 9", "C#", "Entity Framework Core", "PostgreSQL", "Docker"],
      },
      {
        number: "03",
        name: "Wiro AI ML Infrastructure Platform",
        company: "Wiro AI",
        description:
          "Plataforma de infraestructura para operaciones IA/ML: workers GPU, distribución de peticiones, flujos de prueba de modelos y monitorización en vivo, diseñada para hacer los sistemas internos más observables y operables.",
        themes: [
          "Orquestación de workers GPU",
          "Distribución de peticiones",
          "Visibilidad del sistema",
        ],
        tags: [".NET 8", "Redis", "PostgreSQL", "Docker", "Linux", "SignalR"],
      },
      {
        number: "04",
        name: "Jetlink Multi-Project Chatbot Platform",
        company: "Jetlink",
        description:
          "Plataforma full-stack de chatbot con CMS, APIs, reporting, integraciones y UI de usuario final. Incluyó modernización de .NET legacy y flujos de comunicación en tiempo real.",
        themes: [
          "Arquitectura de plataforma",
          "Modernización legacy",
          "Sistemas con muchas integraciones",
        ],
        tags: [".NET 6", "MongoDB", "WebSockets", "React", "TypeScript", "IIS"],
      },
    ],
  },
  capabilities: {
    sectionNumber: "05",
    sectionTitle: "CAPACIDADES",
    groups: [
      {
        category: "Backend",
        items: [
          ".NET / C#",
          "ASP.NET Core",
          "Diseño de APIs REST",
          "Microservices",
          "Entity Framework Core",
          "SignalR",
        ],
      },
      {
        category: "Datos",
        items: [
          "PostgreSQL",
          "Redis",
          "MongoDB",
          "SQL Server",
          "Modelado de datos",
          "Rendimiento de consultas",
        ],
      },
      {
        category: "Plataforma",
        items: [
          "Docker",
          "Kubernetes",
          "Linux",
          "Pensamiento CI/CD",
          "Preparación operativa",
          "Gestión de entornos",
        ],
      },
      {
        category: "Fluidez Full Stack",
        items: [
          "React",
          "Next.js",
          "TypeScript",
          "Blazor",
          "Tailwind CSS",
          "Entrega end-to-end",
        ],
      },
    ],
    callout:
      "Mi punto más fuerte es la arquitectura backend y el criterio de ingeniería: construir sistemas que otros ingenieros puedan ampliar, operar y en los que puedan confiar bajo presión.",
    statLabel: "4+ AÑOS · SISTEMAS EN PRODUCCIÓN",
  },
  contact: {
    sectionNumber: "06",
    sectionTitle: "CONTACTO",
    headline: "Construyamos algo que importe.",
    intro:
      "Disponible para roles senior, consultoría y colaboraciones serias de producto.",
    body:
      "Si estás construyendo un producto que necesita sistemas backend fiables, propiedad técnica clara y decisiones de ingeniería que aguanten en producción, hablemos.",
    form: {
      nameLabel: "Nombre",
      emailLabel: "Correo",
      subjectLabel: "Asunto",
      messageLabel: "Mensaje",
      submitLabel: "Enviar mensaje",
      submittingLabel: "Enviando...",
      placeholders: {
        name: "Tu nombre completo",
        email: "tu@email.com",
        subject: "¿De qué se trata?",
        message: "Cuéntame sobre el rol, producto o sistema que quieres discutir.",
      },
      validation: {
        nameRequired: "Introduce tu nombre.",
        emailInvalid: "Introduce un correo válido.",
        subjectRequired: "Introduce un asunto.",
        messageRequired: "Introduce un mensaje.",
        messageMinLength: "El mensaje debe tener al menos 10 caracteres.",
      },
      success: "Mensaje recibido. Te responderé lo antes posible.",
      securityLoading: "Protegiendo formulario...",
      secured: "Formulario protegido",
      blocked: "Bloqueado temporalmente",
    },
  },
  footer: {
    strapline: "Senior Backend Engineer · alptalha.dev",
    copyright: "Todos los derechos reservados.",
  },
  notFound: {
    eyebrow: "ERROR 404",
    title: "Ruta no encontrada.",
    description:
      "La página que buscas no existe o se ha movido. Al menos el fallo está manejado con limpieza.",
    primaryCta: "Volver al portafolio",
    secondaryCta: "Volver",
  },
};
