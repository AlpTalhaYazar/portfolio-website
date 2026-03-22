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
    headline:
      "Construyo sistemas backend que siguen siendo fiables bajo carga real.",
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
        role: "Software Engineer",
        period: "2025 - Actualidad",
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
        period: "2023 - 2025",
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
        period: "2021 - 2023",
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
    expandLabel: "Inspeccionar informe técnico",
    collapseLabel: "Cerrar informe técnico",
    inspectionEyebrow: "Dossier técnico",
    inspectionHint:
      "Notas de implementación en capas y contexto de arquitectura.",
    inspectionActiveLabel: "Inspección activa",
    previewLabels: {
      context: "Contexto",
      focus: "Foco",
      stack: "Stack",
    },
    summaryTitle: "Por qué importaba",
    responsibilitiesTitle: "En qué trabajé",
    footprintTitle: "Huella técnica",
    items: [
      {
        number: "01",
        name: "Plataforma de Gestión Empresarial",
        company: "Dias (Atlastek)",
        contextLabel: "Monitorización, seguimiento y analítica en tiempo real",
        description:
          "Plataforma de gestión empresarial para operaciones a gran escala donde el seguimiento, el diagnóstico, la analítica y los flujos de mantenimiento programado debían mantenerse fiables sobre servicios backend distribuidos.",
        themes: [
          "Monitorización en tiempo real",
          "Analítica y diagnóstico",
          "Planificación operativa",
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
          badgeLabel: "Resumen generalizado",
          note: "Se conserva el tipo de producto, mientras que los flujos y procesos específicos de la institución siguen intencionalmente generalizados.",
          summary:
            "Esta plataforma concentraba varias necesidades operativas en una sola superficie de producción: seguimiento en vivo, visibilidad diagnóstica, reporting y planificación de mantenimiento. El backend tenía que mantener flujos event-driven, movimiento de datos listo para analítica y tareas operativas recurrentes sin volverse frágil.",
          responsibilities: [
            "Trabajé en servicios backend que soportaban seguimiento en vivo, diagnósticos y reporting operativo sobre workflows de gran escala.",
            "Implementé coordinación entre servicios basada en mensajería y background processing para tareas orientadas al mantenimiento y al tiempo.",
            "Contribuí a capacidades de analítica y monitorización usadas para hacer visible la salud operativa, los patrones de uso y el comportamiento del sistema.",
            "Apoyé aspectos de preparación para producción relacionados con límites entre servicios, forma de despliegue y observabilidad runtime.",
          ],
          footprint: [
            "Microservicios .NET 9 coordinados mediante flujos guiados por mensajería",
            "Patrones de comunicación entre servicios basados en MassTransit",
            "Persistencia PostgreSQL orientada a operación y analítica",
            "Topología de despliegue con Kubernetes + Helm para orquestación de servicios",
            "Procesamiento recurrente para cargas de mantenimiento y planificación",
            "Superficies de diagnóstico, seguimiento y reporting afinadas para operaciones en producción",
          ],
        },
      },
      {
        number: "02",
        name: "Sistema Empresarial de Seguimiento de Activos",
        company: "Dias (Atlastek)",
        contextLabel: "Reporting de cumplimiento y flujos regulados de activos",
        description:
          "Sistema empresarial de seguimiento de activos para operaciones reguladas donde la visibilidad de producción, la auditabilidad, el acceso por roles y el reporting debían mantenerse fiables entre distintos tenants.",
        themes: [
          "Seguimiento orientado al cumplimiento",
          "Control de acceso multi-tenant",
          "Preparación para reporting y auditoría",
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
          badgeLabel: "Resumen generalizado",
          note: "Se conserva el tipo de producto, mientras que los flujos y procesos específicos de la institución siguen intencionalmente generalizados.",
          summary:
            "Este sistema estaba centrado en seguir activos y movimiento operativo dentro de un entorno regulado, con requisitos de reporting y auditoría que influían en el backend tanto como los workflows centrales. El trabajo combinó límites multi-tenant, acceso por roles, pipelines de reporting y comportamiento escalable de servicios.",
          responsibilities: [
            "Desarrollé flujos backend que soportaban seguimiento de producción y distribución con límites de acceso conscientes del tenant.",
            "Trabajé sobre reporting orientado a cumplimiento, auditabilidad y estados de workflow que requerían visibilidad histórica consistente.",
            "Ayudé a implementar patrones de acceso por roles y comportamiento de servicios adecuados para uso empresarial multi-tenant.",
            "Contribuí a superficies de analítica y reporting que convertían la actividad operativa en salidas útiles para reguladores y operadores.",
          ],
          footprint: [
            "Capa de servicios .NET 9 con REST APIs y background processing",
            "Entity Framework Core + PostgreSQL para datos transaccionales y de reporting",
            "Redis para caching y coordinación runtime",
            "Patrones backend conscientes del tenant y del acceso por roles",
            "Flujos de reporting y auditoría modelados para operaciones reguladas",
            "Topología de servicios dockerizada para despliegue empresarial escalable",
          ],
        },
      },
      {
        number: "03",
        name: "Wiro AI ML Infrastructure Platform",
        company: "Wiro AI",
        contextLabel:
          "Workers GPU, pruebas de modelos y enrutamiento de peticiones",
        description:
          "Plataforma de infraestructura IA/ML que combina workers GPU, distribución de peticiones, superficies de prueba de modelos y monitorización en vivo para hacer las operaciones de modelos más ejecutables y observables.",
        themes: [
          "Orquestación de workers GPU",
          "Superficies de prueba de modelos",
          "Visibilidad del sistema en tiempo real",
        ],
        tags: [".NET 8", "Blazor", "PostgreSQL", "Redis", "Docker", "SignalR"],
        details: {
          summary:
            "Wiro unía varias superficies de producto conectadas: ejecución de workers sobre máquinas Linux con GPU, servicios de enrutamiento de peticiones, interfaces para probar modelos y vistas de monitorización. El valor no estaba solo en ejecutar inferencia, sino en volver todo el flujo operable, visible y repetible para los equipos de ingeniería.",
          responsibilities: [
            "Trabajé en servicios worker orientados a GPU ejecutándose en entornos Linux con soporte de procesamiento respaldado por NVIDIA.",
            "Desarrollé y mantuve servicios tipo controller para routing de peticiones, coordinación y gestión de acceso a nivel de API.",
            "Contribuí a superficies internas basadas en Blazor usadas por ML engineers para probar modelos y ajustar configuración.",
            "Implementé flujos de monitorización y feedback operativo, incluyendo actualizaciones en tiempo real sobre estado del sistema y comportamiento runtime.",
          ],
          footprint: [
            "Servicios .NET 8 que abarcan workers, controllers y superficies API",
            "Interfaz Blazor + Tailwind para pruebas de modelos y configuración operativa",
            "REST APIs con límites de acceso internos y externos",
            "PostgreSQL + Redis para estado runtime y datos de soporte",
            "Monitorización en vivo impulsada por SignalR para visibilidad de infraestructura",
            "Runtime Dockerizado sobre Linux diseñado para cargas con GPU",
          ],
        },
      },
      {
        number: "04",
        name: "Jetlink Multi-Project Chatbot Platform",
        company: "Jetlink",
        contextLabel: "CMS, APIs, superficies de chatbot e integraciones",
        description:
          "Plataforma de chatbot multi-superficie que abarca herramientas de gestión, APIs, experiencias de chatbot para usuario final, reporting e integraciones en tiempo real entre web y canales sociales.",
        themes: [
          "Plataforma de chatbot omnicanal",
          "Modernización legacy",
          "Integraciones en tiempo real",
        ],
        tags: [".NET 6", "MongoDB", "WebSockets", "React", "TypeScript", "IIS"],
        details: {
          summary:
            "Jetlink no era una sola interfaz, sino una plataforma conectada: herramientas CMS, APIs internas y externas, superficies de chatbot embebibles, flujos de reporting e integraciones sociales o por canal. Una parte importante del valor técnico vino de mover piezas legacy de .NET 4.7 hacia una arquitectura más mantenible orientada a .NET 6 sin romper la continuidad del producto.",
          responsibilities: [
            "Trabajé a través de superficies CMS, API, reporting y chatbot para usuario final en lugar de una sola aplicación aislada.",
            "Implementé y mantuve integraciones REST internas y externas, incluyendo flujos de comunicación tipo webhook y orientados a canales.",
            "Contribuí al comportamiento de mensajería en tiempo real y a las capas de interacción de usuario usando WebSockets y componentes UI orientados a web.",
            "Apoyé la ruta de migración desde componentes legacy en .NET 4.7 hacia una arquitectura más moderna en .NET 6 sin perder continuidad de plataforma.",
          ],
          footprint: [
            "Superficies de gestión basadas en ASP.NET MVC + React y flujos UI híbridos",
            "REST APIs y puntos de integración webhook para conectividad de plataforma",
            "Datos de aplicación respaldados por MongoDB en superficies de chatbot y reporting",
            "Comportamiento de comunicación en tiempo real impulsado por WebSockets",
            "Modelo de despliegue sobre Windows Server e IIS para entrega multi-entorno",
            "Integraciones sobre web chat y canales como WhatsApp, Facebook e Instagram",
          ],
        },
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
    statLabel: "5+ AÑOS · SISTEMAS EN PRODUCCIÓN",
  },
  contact: {
    sectionNumber: "06",
    sectionTitle: "CONTACTO",
    headline: "Construyamos algo que importe.",
    intro:
      "Disponible para roles senior, consultoría y colaboraciones serias de producto.",
    body: "Si estás construyendo un producto que necesita sistemas backend fiables, propiedad técnica clara y decisiones de ingeniería que aguanten en producción, hablemos.",
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
        message:
          "Cuéntame sobre el rol, producto o sistema que quieres discutir.",
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
