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
        name: "Regüle İzleme ve Yönetim Platformu",
        company: "DİAS Teknoloji",
        contextLabel: "İzleme, operasyonel veri akışları ve raporlama",
        description:
          "İzleme, raporlama, asenkron işleme ve production görünürlüğünün gerçek operasyonel kısıtlar altında güvenilir kalması gereken regüle operasyonlara yönelik backend platformu.",
        themes: [
          "Gerçek zamanlı izleme",
          "Mesajlaşma tabanlı iş akışları",
          "Operasyonel güvenilirlik",
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
          badgeLabel: "Genelleştirilmiş özet",
          note: "Program ve kuruma özgü ayrıntılar bilinçli olarak genelleştirilmiştir; bu özet yalnızca paylaşılması güvenli mühendislik kapsamına odaklanır.",
          summary:
            "Mühendislik odağı; net servis sınırlarını ve sürdürülebilir production davranışını korurken operasyonel veri akışlarını, background processing süreçlerini, raporlamayı ve runtime görünürlüğünü güvenilir tutmaktı.",
          responsibilities: [
            "İzleme, operasyonel iş akışları ve raporlama için backend servisleri geliştirdim ve iyileştirdim.",
            "Servis sınırları boyunca mesajlaşma tabanlı koordinasyon ve background processing uyguladım.",
            "Veri erişimi, runtime görünürlüğü, otomatik testler ve production sorunlarının çözümü üzerinde çalıştım.",
            "Özellikleri gereksinimlerin netleştirilmesinden release hazırlığı ve release sonrası desteğe kadar takip ettim.",
          ],
          footprint: [
            ".NET 9/10 servisleri ve REST API'ler",
            "RabbitMQ / MassTransit mesajlaşması ve background iş akışları",
            "PostgreSQL ve Redis tabanlı uygulama davranışı",
            "Docker tabanlı teslimat ve ortam tutarlılığı",
            "Otomatik testler ve production gözlemlenebilirliği",
          ],
        },
      },
      {
        number: "02",
        name: "Regüle Varlık Takip Platformu",
        company: "DİAS Teknoloji",
        contextLabel: "Domain modelleme, yetkilendirme, izlenebilirlik ve raporlama",
        description:
          "Güvenilir kalıcılık, yetkilendirme sınırları, denetlenebilirlik ve raporlamaya hazır veri akışlarına odaklanan regüle varlık ve iş akışı takip platformu.",
        themes: [
          "Regüle iş akışları",
          "Yetkilendirme sınırları",
          "Raporlama ve izlenebilirlik",
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
          badgeLabel: "Genelleştirilmiş özet",
          note: "Program ve kuruma özgü ayrıntılar bilinçli olarak genelleştirilmiştir; bu özet yalnızca paylaşılması güvenli mühendislik kapsamına odaklanır.",
          summary:
            "Backend; operasyonel karmaşıklığı API tüketicilerine yansıtmadan net domain sınırları, güvenilir yetkilendirme, tutarlı tarihsel görünürlük ve raporlama odaklı veri davranışı sağlamalıydı.",
          responsibilities: [
            "Regüle takip senaryoları için backend iş akışlarını ve kalıcılık sınırlarını modelledim.",
            "Yetkilendirme farkındalığı olan servis davranışı ve raporlamaya hazır veri akışları uyguladım.",
            "Sorgu davranışı, doğrulama, otomatik testler ve operasyonel güvenilirlik üzerinde çalıştım.",
            "Gereksinimleri sürdürülebilir API ve domain davranışına dönüştürmek için iş birimleriyle çalıştım.",
          ],
          footprint: [
            ".NET 9/10 REST API'leri ve domain servisleri",
            "PostgreSQL ile Entity Framework Core",
            "Caching ve runtime koordinasyonu için Redis",
            "Yetkilendirme ve denetlenebilirlik odaklı servis sınırları",
            "Docker tabanlı teslimat ve otomatik doğrulama",
          ],
        },
      },
      {
        number: "03",
        name: "Regüle İş Akışı ve Doğrulama Platformu",
        company: "DİAS Teknoloji",
        contextLabel: "İş analizi, güvenli API'ler ve denetime hazır iş akışları",
        description:
          "Domain netliği, güvenli doğrulama davranışı, yetkilendirme, denetlenebilirlik ve release güveninin temel mühendislik odağı olduğu regüle iş akışlarına yönelik backend platformu.",
        themes: [
          "Domain odaklı iş akışları",
          "Güvenli doğrulama",
          "Uçtan uca teslimat sahipliği",
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
          badgeLabel: "Genelleştirilmiş özet",
          note: "Program ve kuruma özgü ayrıntılar bilinçli olarak genelleştirilmiştir; bu özet yalnızca paylaşılması güvenli mühendislik kapsamına odaklanır.",
          summary:
            "Bu çalışma; iş gereksinimlerinin netleştirilmesi ve domain modellemeden API tasarımı, yetkilendirme, otomatik doğrulama, release hazırlığı ve production desteğine kadar uçtan uca sahiplik gerektiriyor.",
          responsibilities: [
            "Gereksinimleri ve domain sınırlarını netleştirmek için iş birimleriyle doğrudan çalıştım.",
            "Regüle iş akışları için API'ler, yetkilendirme davranışı ve kalıcılık kuralları tasarladım.",
            "Domain, application ve API sözleşmeleri çevresinde otomatik testler geliştirdim.",
            "Teslimatı review, release hazırlığı ve production odaklı destek boyunca takip ettim.",
          ],
          footprint: [
            ".NET 9/10 application ve API sınırları",
            "Entity Framework Core ve PostgreSQL kalıcılığı",
            "Keycloak tabanlı kimlik ve yetkilendirme entegrasyonu",
            "Otomatik domain, application ve API testleri",
            "Docker tabanlı ortamlar ve release hazırlığı",
          ],
        },
      },
      {
        number: "04",
        name: "Wiro AI Altyapı Platformu",
        company: "Wiro AI",
        contextLabel: "GPU worker'lar, model test yüzeyleri ve request routing",
        description:
          "GPU destekli Linux ortamları için worker processing, request koordinasyonu, model test yüzeyleri, iç operasyon araçları ve gerçek zamanlı görünürlüğü birleştiren AI/ML altyapı platformu.",
        themes: [
          "Worker processing",
          "Request koordinasyonu",
          "Gerçek zamanlı operasyonel görünürlük",
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
            "Wiro; GPU destekli Linux ortamlarında worker processing ve request koordinasyonunu model test yüzeyleri, iç operasyon araçları ve gerçek zamanlı görünürlükle bir araya getiriyordu.",
          responsibilities: [
            "GPU destekli Linux ortamlarında çalışan worker servisleri geliştirdim ve destekledim.",
            "Request routing, koordinasyon ve API erişimi için backend servisleri geliştirdim.",
            "Platform yeteneklerini test etmek ve işletmek için kullanılan Blazor iç araçlarına katkı verdim.",
            "Runtime davranışı için gerçek zamanlı monitoring ve operasyonel geri bildirim uyguladım.",
          ],
          footprint: [
            "Worker, koordinasyon ve API yüzeylerini kapsayan .NET servisleri",
            "Runtime durumu ve uygulama verisi için PostgreSQL ve Redis",
            "Gerçek zamanlı platform görünürlüğü için SignalR",
            "GPU destekli workload'lar için Dockerize Linux runtime",
            "İç operasyon yüzeyi olarak Blazor araçları",
          ],
        },
      },
      {
        number: "05",
        name: "Jetlink Chatbot Platformu",
        company: "Jetlink",
        contextLabel: "CMS, API'ler, chatbot yüzeyleri ve entegrasyonlar",
        description:
          "API'leri, entegrasyonları, yönetim araçlarını, raporlamayı, son kullanıcı mesajlaşmasını ve production ortamlarındaki gerçek zamanlı iletişimi kapsayan çok yüzeyli chatbot platformu.",
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
            "İç ve public API sınırları boyunca üçüncü taraf ve kanal entegrasyonları",
          ],
        },
      },
      {
        number: "06",
        name: "ScopePoker Gerçek Zamanlı Tahmin Platformu",
        company: "Kişisel Proje",
        contextLabel: "Gerçek zamanlı oturumlar, backend API'leri ve bağımsız teslimat",
        description:
          "Backend API'leri, oturum davranışı, WebSocket iletişimi, kalıcılık, caching, ortak sözleşmeler ve deployment boyunca bağımsız sahipliği gösteren gerçek zamanlı Scrum tahmin ürünü.",
        themes: [
          "Gerçek zamanlı iş birliği",
          "Güvenli oturum akışları",
          "Bağımsız ürün sahipliği",
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
          badgeLabel: "Kişisel ürün",
          summary:
            "ScopePoker; gerçek zamanlı tahmin oturumlarını, backend API'lerini, kalıcılığı, caching'i ve tip güvenli web istemcisini bağımsız geliştirilen tek bir üründe bir araya getiriyor. Bu vaka çalışması UI araçlarından çok backend davranışına ve operasyonel sahipliğe odaklanıyor.",
          responsibilities: [
            "Tahmin oturumları için backend API'leri ve ortak tip güvenli sözleşmeler tasarladım.",
            "WebSocket tabanlı oda davranışını ve oturum yaşam döngüsü boyunca güvenli erişimi uyguladım.",
            "Kalıcı veriyi Prisma ve PostgreSQL ile modelledim; runtime koordinasyonu için Redis kullandım.",
            "Container tabanlı teslimat, deployment hazırlığı ve production sorunlarının çözümünü üstlendim.",
          ],
          footprint: [
            "Fastify API'leri ve ortak TypeScript sözleşmeleri",
            "WebSocket tabanlı gerçek zamanlı oturum iletişimi",
            "Prisma ile PostgreSQL kalıcılığı",
            "Redis tabanlı runtime koordinasyonu",
            "Dockerize backend ve web teslimatı",
            "Tamamlayıcı teslimat katmanı olarak React ürün yüzeyi",
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
