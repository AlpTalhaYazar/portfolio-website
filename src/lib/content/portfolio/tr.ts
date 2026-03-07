import type { PortfolioContent } from "@/types/portfolio";

export const portfolioContentTr: PortfolioContent = {
  locale: "tr",
  metadata: {
    title: "Alp Talha Yazar | Senior Backend Engineer",
    description:
      "Gerçek production ortamları için güvenilir kurumsal sistemler, API'ler ve dağıtık platformlar geliştiren Senior Backend Engineer.",
  },
  nav: {
    homeLabel: "ATY",
    items: [
      { label: "Projeler", href: "#projects" },
      { label: "Deneyim", href: "#experience" },
      { label: "Hakkımda", href: "#about" },
      { label: "İletişim", href: "#contact" },
    ],
    languageLabel: "Dil",
    letsTalkLabel: "Konuşalım",
    closeMenuLabel: "Navigasyonu kapat",
    openMenuLabel: "Navigasyonu aç",
  },
  hero: {
    eyebrow: "SENIOR BACKEND ENGINEER",
    availability: "REMOTE ROLLER İÇİN UYGUN",
    headline: "Gerçek yük altında güvenilir kalan backend sistemleri geliştiriyorum.",
    supportingText:
      "Production ortamındaki kurumsal yazılımlar için mimari, güvenilirlik ve ölçek.",
    primaryCta: "Öne Çıkan İşler",
    secondaryCta: "İletişime Geç",
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
    sectionTitle: "HAKKIMDA",
    lead: "Gerçek koşullarda ayakta kalan backend sistemleri geliştiren bir yazılım mühendisi.",
    paragraphs: [
      "Bir ürün yoğunlaştığında sağlam kalması gereken katmanlarda çalışıyorum: API'ler, servis sınırları, veri akışları, kuyruklar, deployment süreçleri ve bunların etrafındaki operasyonel kararlar.",
      "En güçlü işlerimi enterprise B2B ve B2G yazılımlarda, AI altyapısında ve doğruluk, sürdürülebilirlik ve gözlemlenebilirlik isteyen platform tarzı sistemlerde ürettim.",
      "Ağırlıklı olarak .NET ve C# ile geliştiriyorum; PostgreSQL, Redis, Docker ve Kubernetes tarafında rahat çalışıyorum; ürün gerektiğinde teslimat ile mimariyi birlikte düşünebilen biri olarak stack boyunca ilerleyebiliyorum.",
    ],
    statusPill: "Türkiye'de · Remote fırsatlara açık",
  },
  experience: {
    sectionNumber: "03",
    sectionTitle: "DENEYİM",
    intro:
      "Gerçek production kısıtları altında çalışması gereken sistemler geliştirerek geçen 4+ yıl.",
    items: [
      {
        number: "01",
        company: "Dias (Atlastek)",
        role: "Backend Developer",
        period: "2023 - Günümüz",
        location: "Türkiye",
        description:
          "Regüle ortamlara yönelik enterprise seviyede B2G takip ve yönetim sistemleri geliştiriyorum. Dağıtık production stack üzerinde servis güvenilirliği, yoğun veri akışları ve operasyonel görünürlük tarafına odaklanıyorum.",
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
        period: "Tem 2023 - Ağu 2024",
        location: "İstanbul, Türkiye",
        description:
          "Linux GPU worker'ları, model test arayüzleri, LLM request dağıtımı, API'ler ve canlı izleme içeren AI/ML altyapıları geliştirdim. Orkestrasyon, iç araçlar ve sistem görünürlüğü tarafında yoğun çalıştım.",
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
        location: "Türkiye",
        description:
          "CMS, REST API, son kullanıcı arayüzü, raporlama ve entegrasyonlardan oluşan çok projeli chatbot platformunda çalıştım. Legacy'den moderne geçişi yönettim ve hem backend ağırlıklı hem ürün yüzeyine yakın alanlarda teslimat yaptım.",
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
    sectionTitle: "SEÇİLMİŞ İŞLER",
    intro: "Demo için değil, production için kurulmuş sistemler.",
    items: [
      {
        number: "01",
        name: "Enterprise Management Platform",
        company: "Dias (Atlastek)",
        description:
          "Regüle sektörlerde enterprise müşteriler için gerçek zamanlı operasyon izleme ve takip sistemi. Yüksek uptime, yoğun event akışları ve servisler arası koordinasyon etrafında şekillendi.",
        themes: [
          "Operasyonel güvenilirlik",
          "Gerçek zamanlı izleme",
          "Yüksek hacimli veri akışı",
        ],
        tags: [".NET 9", "PostgreSQL", "Redis", "RabbitMQ", "Docker", "Kubernetes"],
      },
      {
        number: "02",
        name: "Enterprise Asset Tracking System",
        company: "Dias (Atlastek)",
        description:
          "Compliance yoğun ortamlarda çalışan multi-tenant varlık takip ve raporlama sistemi. Audit edilebilirlik, domain netliği ve stabil backend sözleşmeleri kritik rol oynadı.",
        themes: [
          "Regüle ortamlar",
          "Multi-tenant mimari",
          "Raporlama ve uyumluluk",
        ],
        tags: [".NET 9", "C#", "Entity Framework Core", "PostgreSQL", "Docker"],
      },
      {
        number: "03",
        name: "Wiro AI ML Infrastructure Platform",
        company: "Wiro AI",
        description:
          "AI/ML operasyonları için GPU worker'lar, request dağıtımı, model test akışları ve canlı izleme içeren altyapı platformu. İç sistemleri daha gözlemlenebilir ve işletilebilir hale getirmek için kuruldu.",
        themes: [
          "GPU worker orkestrasyonu",
          "Request dağıtımı",
          "Sistem görünürlüğü",
        ],
        tags: [".NET 8", "Redis", "PostgreSQL", "Docker", "Linux", "SignalR"],
      },
      {
        number: "04",
        name: "Jetlink Multi-Project Chatbot Platform",
        company: "Jetlink",
        description:
          "CMS, API, raporlama, entegrasyonlar ve son kullanıcı arayüzünü kapsayan full-stack chatbot platformu. Legacy .NET modernizasyonu ve gerçek zamanlı iletişim akışlarını da içerdi.",
        themes: [
          "Platform mimarisi",
          "Legacy modernizasyonu",
          "Entegrasyon yoğun sistemler",
        ],
        tags: [".NET 6", "MongoDB", "WebSockets", "React", "TypeScript", "IIS"],
      },
    ],
  },
  capabilities: {
    sectionNumber: "05",
    sectionTitle: "YETENEKLER",
    groups: [
      {
        category: "Backend",
        items: [
          ".NET / C#",
          "ASP.NET Core",
          "REST API tasarımı",
          "Microservices",
          "Entity Framework Core",
          "SignalR",
        ],
      },
      {
        category: "Veri",
        items: [
          "PostgreSQL",
          "Redis",
          "MongoDB",
          "SQL Server",
          "Veri modelleme",
          "Query performansı",
        ],
      },
      {
        category: "Platform",
        items: [
          "Docker",
          "Kubernetes",
          "Linux",
          "CI/CD yaklaşımı",
          "Operasyonel hazırlık",
          "Environment yönetimi",
        ],
      },
      {
        category: "Full Stack Yetkinliği",
        items: [
          "React",
          "Next.js",
          "TypeScript",
          "Blazor",
          "Tailwind CSS",
          "Uçtan uca teslimat",
        ],
      },
    ],
    callout:
      "En güçlü tarafım backend mimarisi ve mühendislik muhakemesi: başka mühendislerin rahatça geliştirebildiği, işletebildiği ve baskı altında güvenebildiği sistemler kurmak.",
    statLabel: "4+ YIL · PRODUCTION SİSTEMLER",
  },
  contact: {
    sectionNumber: "06",
    sectionTitle: "İLETİŞİM",
    headline: "Önemli işler üretelim.",
    intro:
      "Senior roller, danışmanlık işleri ve ciddi ürün işbirlikleri için açığım.",
    body:
      "Güvenilir backend sistemlerine, net teknik sahipliğe ve production'da ayakta kalan mühendislik kararlarına ihtiyacınız varsa konuşalım.",
    form: {
      nameLabel: "İsim",
      emailLabel: "E-posta",
      subjectLabel: "Konu",
      messageLabel: "Mesaj",
      submitLabel: "Mesaj Gönder",
      submittingLabel: "Gönderiliyor...",
      placeholders: {
        name: "Adınız soyadınız",
        email: "eposta@ornek.com",
        subject: "Ne üzerine konuşalım?",
        message: "Rolü, ürünü veya sistemi kısaca anlatın.",
      },
      validation: {
        nameRequired: "Lütfen isminizi girin.",
        emailInvalid: "Geçerli bir e-posta adresi girin.",
        subjectRequired: "Lütfen konu girin.",
        messageRequired: "Lütfen mesaj girin.",
        messageMinLength: "Mesaj en az 10 karakter olmalı.",
      },
      success: "Mesaj alındı. En kısa sürede dönüş yapacağım.",
      securityLoading: "Form güvenliği hazırlanıyor...",
      secured: "Form güvenli",
      blocked: "Geçici olarak engellendi",
    },
  },
  footer: {
    strapline: "Senior Backend Engineer · alptalha.dev",
    copyright: "Tüm hakları saklıdır.",
  },
  notFound: {
    eyebrow: "HATA 404",
    title: "Rota bulunamadı.",
    description:
      "Aradığınız sayfa yok veya taşınmış. En azından hata temiz şekilde ele alınıyor.",
    primaryCta: "Portföye Dön",
    secondaryCta: "Geri Dön",
  },
};
