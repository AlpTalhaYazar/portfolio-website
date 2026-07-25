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
    primaryNavLabel: "Ana navigasyon",
    mobileNavLabel: "Mobil navigasyon",
    footerNavLabel: "Alt bilgi navigasyonu",
  },
  hero: {
    eyebrow: "SENIOR BACKEND ENGINEER",
    availability: "REMOTE BACKEND ROLLERİNE AÇIK",
    headline:
      "Gerçek yük altında güvenilir kalan backend sistemleri geliştiriyorum.",
    supportingText:
      "Production ortamındaki kurumsal yazılımlar için mimari, güvenilirlik ve uçtan uca teslimat sahipliği.",
    primaryCta: "Öne Çıkan İşler",
    secondaryCta: "İletişime Geç",
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
    sectionTitle: "HAKKIMDA",
    lead: "Gerçek koşullarda ayakta kalan backend sistemleri geliştiren bir yazılım mühendisi.",
    paragraphs: [
      "Bir ürün yoğunlaştığında sağlam kalması gereken katmanlarda çalışıyorum: API'ler, servis sınırları, veri akışları, kuyruklar, deployment süreçleri ve bunların etrafındaki operasyonel kararlar.",
      "En güçlü işlerimi enterprise B2B ve B2G yazılımlarda, AI altyapısında ve doğruluk, sürdürülebilirlik ve gözlemlenebilirlik isteyen platform tarzı sistemlerde ürettim.",
      "Ağırlıklı olarak .NET ve C# ile geliştiriyorum; PostgreSQL, Redis, RabbitMQ/MassTransit ve Docker tarafında rahat çalışıyorum. Ürün teslimatı gerektiğinde hem uygulamayı hem mimariyi anlayarak komşu katmanlarda da ilerleyebiliyorum.",
    ],
    statusPill: "Türkiye'de · Remote backend fırsatlarına açık",
  },
  experience: {
    sectionNumber: "03",
    sectionTitle: "DENEYİM",
    intro:
      "Gerçek production kısıtları altında çalışması gereken sistemleri; mimari, güvenilirlik ve operasyonel netlik odağıyla geliştiriyorum.",
    items: [
      {
        number: "01",
        company: "DİAS Teknoloji",
        role: "Yazılım Geliştirme Uzmanı",
        period: "2025 - Günümüz",
        location: "İstanbul, Türkiye",
        description:
          "Regüle B2G platformlarında uçtan uca backend teslimatını üstleniyor; iş gereksinimlerini sürdürülebilir servis ve iş akışlarına dönüştürüyorum. API ve domain tasarımı, yetkilendirme sınırları, asenkron işleme, otomatik testler, gözlemlenebilirlik, release hazırlığı ve production sorunlarının çözümü boyunca çalışıyorum.",
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
        location: "İstanbul, Türkiye",
        description:
          "Model testleri, request routing, worker tabanlı işleme, asenkron akışlar, GPU destekli Linux ortamları, Blazor iç araçları ve gerçek zamanlı operasyonel görünürlük içeren AI/ML altyapılarında backend ve platform yetenekleri geliştirdim.",
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
        location: "İstanbul, Türkiye",
        description:
          "Çok yüzeyli bir chatbot platformu için API'ler, entegrasyonlar, raporlama akışları ve gerçek zamanlı iletişim geliştirdim. Legacy .NET bileşenlerini modernize ettim; veritabanı değişiklikleri, Windows/IIS deployment süreçleri ve production sorunlarının çözümünü destekledim.",
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
    sectionTitle: "SEÇİLMİŞ İŞLER",
    intro: "Demo için değil, production için kurulmuş sistemler.",
    expandLabel: "Teknik özeti incele",
    collapseLabel: "Teknik özeti kapat",
    inspectionEyebrow: "Teknik dosya",
    inspectionHint: "Katmanlı uygulama notları ve mimari bağlam.",
    inspectionActiveLabel: "İnceleme açık",
    previewLabels: {
      context: "Bağlam",
      focus: "Odak",
      stack: "Stack",
    },
    summaryTitle: "Neden kritikti",
    responsibilitiesTitle: "Benim katkım",
    footprintTitle: "Teknik ayak izi",
    items: [
      {
        number: "01",
        name: "Kurumsal Yönetim Platformu",
        company: "Dias (Atlastek)",
        contextLabel: "Gerçek zamanlı izleme, takip ve analitik",
        description:
          "Büyük ölçekli operasyonlarda takip, teşhis, analitik ve zamanlanmış bakım akışlarının dağıtık backend servisleri üzerinde güvenilir kalması gereken kurumsal yönetim platformu.",
        themes: [
          "Gerçek zamanlı izleme",
          "Analitik ve teşhis",
          "Operasyonel planlama",
        ],
        tags: [
          ".NET 9",
          "MassTransit",
          "PostgreSQL",
          "Docker",
          "Microservices",
        ],
        details: {
          badgeLabel: "Genelleştirilmiş özet",
          note: "Ürün tipi korunurken kurum özelindeki iş akışları ve süreç detayları bilinçli olarak genelleştirildi.",
          summary:
            "Bu platform canlı takip, teşhis görünürlüğü, raporlama ve bakım planlaması gibi operasyonel ihtiyaçları tek bir production yüzeyinde topluyordu. Backend tarafında event-driven akışların, analitiğe uygun veri hareketinin ve tekrarlayan operasyonel görevlerin kırılganlaşmadan çalışması gerekiyordu.",
          responsibilities: [
            "Canlı takip, teşhis ve operasyonel raporlama ihtiyaçlarını besleyen backend servislerinde çalıştım.",
            "Bakım odaklı ve zaman bazlı görevler için mesajlaşma tabanlı servis koordinasyonu ve background processing akışları uyguladım.",
            "Operasyonel sağlık, kullanım örüntüleri ve sistem davranışını görünür kılan analitik ve monitoring yeteneklerine katkı verdim.",
            "Servis sınırları, deployment yapısı ve runtime gözlemlenebilirliği gibi production hazırlığı konularını destekledim.",
          ],
          footprint: [
            "Mesajlaşma tabanlı akışlarla koordine edilen .NET 9 microservice yapısı",
            "Platform servisleri arasında MassTransit tabanlı iletişim desenleri",
            "Operasyonel ve analitik odaklı PostgreSQL kalıcılığı",
            "Docker tabanlı teslimat ve ortam tutarlılığı",
            "Bakım ve planlama yükleri için tekrarlayan processing akışları",
            "Production operasyonlarına uyarlanmış teşhis, takip ve raporlama yüzeyleri",
          ],
        },
      },
      {
        number: "02",
        name: "Kurumsal Varlık Takip Sistemi",
        company: "Dias (Atlastek)",
        contextLabel: "Uyumluluk raporlaması ve regüle varlık akışları",
        description:
          "Regüle operasyonlarda üretim görünürlüğü, denetlenebilirlik, rol bazlı erişim ve raporlamanın tenant sınırları boyunca güvenilir kalması gereken kurumsal varlık takip sistemi.",
        themes: [
          "Uyumluluk odaklı takip",
          "Multi-tenant erişim kontrolü",
          "Raporlama ve denetim hazırlığı",
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
          badgeLabel: "Genelleştirilmiş özet",
          note: "Ürün tipi korunurken kurum özelindeki iş akışları ve süreç detayları bilinçli olarak genelleştirildi.",
          summary:
            "Bu sistemde varlık hareketlerinin ve operasyonel akışların regüle bir ortamda izlenmesi gerekiyordu; raporlama ve denetim yükümlülükleri backend mimarisini en az ana iş akışları kadar şekillendiriyordu. Çalışma alanı multi-tenant sınırlar, rol bazlı erişim, raporlama hatları ve ölçeklenebilir servis davranışı etrafında toplandı.",
          responsibilities: [
            "Üretim ve dağıtım takibini tenant farkındalığı olan erişim sınırlarıyla destekleyen backend akışları geliştirdim.",
            "Uyumluluk odaklı raporlama, denetlenebilirlik ve tarihsel görünürlük gerektiren workflow durumları üzerinde çalıştım.",
            "Multi-tenant enterprise kullanıma uygun rol bazlı erişim desenleri ve servis davranışlarına katkı verdim.",
            "Operasyonel hareketi regülatör ve operatör tarafından tüketilebilir çıktılara çeviren analitik ve raporlama yüzeylerini destekledim.",
          ],
          footprint: [
            "REST API ve background processing içeren .NET 9 servis katmanı",
            "Transactional ve raporlama verisi için Entity Framework Core + PostgreSQL",
            "Caching ve runtime koordinasyonu için Redis",
            "Tenant farkındalığı ve rol bazlı backend erişim desenleri",
            "Regüle operasyonlara uyarlanmış raporlama ve denetim akışları",
            "Ölçeklenebilir enterprise deployment için Docker tabanlı servis topolojisi",
          ],
        },
      },
      {
        number: "03",
        name: "Wiro AI ML Infrastructure Platform",
        company: "Wiro AI",
        contextLabel: "GPU worker'lar, model test yüzeyleri ve request routing",
        description:
          "AI/ML operasyonlarını daha yönetilebilir ve gözlemlenebilir kılmak için GPU worker'ları, request dağıtımı, model test yüzeyleri ve canlı izlemeyi bir araya getiren altyapı platformu.",
        themes: [
          "GPU worker orkestrasyonu",
          "Model test yüzeyleri",
          "Gerçek zamanlı sistem görünürlüğü",
        ],
        tags: [".NET 8", "Blazor", "PostgreSQL", "Redis", "Docker", "SignalR"],
        details: {
          summary:
            "Wiro, GPU destekli Linux worker'ları, request routing servisleri, model test arayüzleri ve monitoring yüzeylerini bir araya getiren bağlantılı bir ürün yapısına sahipti. Buradaki değer yalnızca inference çalıştırmak değil, bu süreci görünür, kontrol edilebilir ve tekrar kurulabilir hale getirmekti.",
          responsibilities: [
            "NVIDIA destekli processing yüklerini taşıyan Linux tabanlı GPU worker servislerinde çalıştım.",
            "Request routing, koordinasyon ve API seviyesinde erişim yönetimi yapan controller benzeri servisleri geliştirdim ve destekledim.",
            "ML engineer'ların model test etmesi ve konfigürasyon ayarlaması için kullanılan Blazor tabanlı iç ürün yüzeylerine katkı verdim.",
            "Sistem durumu ve runtime davranışı için gerçek zamanlı geri bildirim sağlayan monitoring akışlarını uyguladım.",
          ],
          footprint: [
            "Worker, controller ve API yüzeylerini kapsayan .NET 8 servisleri",
            "Model test ve operasyonel konfigürasyon için Blazor + Tailwind arayüzü",
            "İç ve dış erişim katmanları olan REST API yüzeyi",
            "Runtime durumu ve destekleyici uygulama verisi için PostgreSQL + Redis",
            "Altyapı görünürlüğü için SignalR tabanlı canlı izleme",
            "GPU destekli workload'lara uygun Dockerize Linux runtime yapısı",
          ],
        },
      },
      {
        number: "04",
        name: "Jetlink Multi-Project Chatbot Platform",
        company: "Jetlink",
        contextLabel: "CMS, API'ler, chatbot yüzeyleri ve entegrasyonlar",
        description:
          "Yönetim araçları, API'ler, son kullanıcı chatbot deneyimleri, raporlama ve web ile sosyal kanallar arasındaki gerçek zamanlı entegrasyonları kapsayan çok yüzeyli chatbot platformu.",
        themes: [
          "Omnichannel chatbot platformu",
          "Legacy modernizasyonu",
          "Gerçek zamanlı entegrasyonlar",
        ],
        tags: [".NET 6", "MongoDB", "WebSockets", "React", "TypeScript", "IIS"],
        details: {
          summary:
            "Jetlink tek bir arayüzden ibaret değildi; CMS araçları, iç ve dış API'ler, gömülebilir chatbot yüzeyleri, raporlama akışları ve sosyal kanal entegrasyonlarını birleştiren bağlı bir platformdu. Mühendislik değerinin önemli kısmı, legacy .NET 4.7 parçalarını platformu kullanılabilir tutarak daha sürdürülebilir bir .NET 6 yönüne taşımaktan geldi.",
          responsibilities: [
            "Tek bir izole uygulama yerine CMS, API, raporlama ve son kullanıcı chatbot yüzeyleri boyunca çalıştım.",
            "Webhook benzeri ve kanal odaklı iletişim akışları dahil olmak üzere iç ve dış REST entegrasyonlarını geliştirdim ve sürdürdüm.",
            "WebSockets ve web yüzeylerindeki UI bileşenleri üzerinden gerçek zamanlı mesajlaşma davranışına katkı verdim.",
            "Platform sürekliliğini koruyarak legacy .NET 4.7 parçalarından daha modern bir .NET 6 mimarisine geçişi destekledim.",
          ],
          footprint: [
            "ASP.NET MVC + React tabanlı yönetim yüzeyleri ve hibrit UI akışları",
            "Platform bağlantıları için REST API ve webhook entegrasyon noktaları",
            "Chatbot ve raporlama yüzeylerinde MongoDB tabanlı uygulama verisi",
            "WebSocket tabanlı gerçek zamanlı iletişim davranışı",
            "Çoklu ortam teslimatı için Windows Server ve IIS deployment modeli",
            "WhatsApp, Facebook ve Instagram gibi kanalları kapsayan entegrasyonlar",
          ],
        },
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
          "ASP.NET Core API'leri",
          "Entity Framework Core",
          "Domain odaklı ve clean architecture",
          "RabbitMQ / MassTransit",
          "SignalR",
        ],
      },
      {
        category: "Veri",
        items: [
          "PostgreSQL",
          "Redis",
          "SQL Server",
          "MongoDB",
          "Veri modelleme",
          "Query performansı",
        ],
      },
      {
        category: "Platform",
        items: [
          "Docker",
          "Linux",
          "CI/CD",
          "Gözlemlenebilirlik",
          "Operasyonel hazırlık",
          "Ortam yönetimi",
        ],
      },
      {
        category: "Tamamlayıcı Yetkinlikler",
        items: [
          "TypeScript",
          "React",
          "Next.js",
          "Blazor",
          "UI entegrasyonu",
          "Uçtan uca teslimat",
        ],
      },
    ],
    callout:
      "En güçlü tarafım backend mimarisi ve mühendislik muhakemesi: başka mühendislerin rahatça geliştirebildiği, işletebildiği ve baskı altında güvenebildiği sistemler kurmak.",
    statLabel: "PRODUCTION SİSTEMLER · MÜHENDİSLİK DERİNLİĞİ",
  },
  contact: {
    sectionNumber: "06",
    sectionTitle: "İLETİŞİM",
    headline: "Önemli işler üretelim.",
    intro:
      "Senior roller, danışmanlık işleri ve ciddi ürün işbirlikleri için açığım.",
    body: "Güvenilir backend sistemlerine, net teknik sahipliğe ve production'da ayakta kalan mühendislik kararlarına ihtiyacınız varsa konuşalım.",
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
      errors: {
        security: "Güvenlik doğrulaması başarısız. Lütfen tekrar deneyin.",
        rateLimited:
          "Çok fazla istek gönderildi. Lütfen {minutes} dakika sonra tekrar deneyin.",
        unavailable:
          "İletişim servisi geçici olarak kullanılamıyor. Lütfen daha sonra tekrar deneyin.",
        failed: "Mesaj gönderilemedi. Lütfen tekrar deneyin.",
      },
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
