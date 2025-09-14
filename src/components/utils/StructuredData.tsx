export default function StructuredData() {
  // Main Person schema
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://www.alptalha.dev/#person",
    name: "Alp Talha Yazar",
    givenName: "Alp Talha",
    familyName: "Yazar",
    jobTitle: "Senior Backend Developer",
    description:
      "Senior Backend Developer with 5+ years experience in .NET, C#, microservices, and enterprise applications. Specializing in scalable B2B/B2G solutions, PostgreSQL databases, and cloud technologies.",
    url: "https://www.alptalha.dev",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://www.alptalha.dev",
    },
    image: {
      "@type": "ImageObject",
      url: "https://www.alptalha.dev/profile-photo.jpg",
      width: 400,
      height: 400,
      caption: "Alp Talha Yazar - Senior Backend Developer",
    },
    sameAs: [
      "https://github.com/alptalha",
      "https://linkedin.com/in/alptalha",
      "https://twitter.com/alptalha_dev",
      "https://www.alptalha.dev",
    ],
    worksFor: {
      "@type": "Organization",
      name: "Freelance Software Developer",
      url: "https://www.alptalha.dev",
    },
    hasOccupation: {
      "@type": "Occupation",
      name: "Senior Backend Developer",
      occupationLocation: {
        "@type": "Place",
        name: "Turkey",
        address: {
          "@type": "PostalAddress",
          addressCountry: "TR",
          addressRegion: "Turkey",
        },
      },
      skills: [
        ".NET",
        "C#",
        "ASP.NET Core",
        "Entity Framework",
        "PostgreSQL",
        "Microservices",
        "RESTful APIs",
        "TypeScript",
        "React",
        "Next.js",
        "Azure",
        "AWS",
        "Docker",
        "System Architecture",
        "Clean Architecture",
      ],
      experienceRequirements: "5+ years",
      educationRequirements: "Computer Science degree or equivalent experience",
    },
    knowsAbout: [
      {
        "@type": "Thing",
        name: ".NET Framework",
        description: "Microsoft's development platform",
      },
      {
        "@type": "Thing",
        name: "C# Programming",
        description: "Object-oriented programming language",
      },
      {
        "@type": "Thing",
        name: "Microservices Architecture",
        description: "Distributed system design pattern",
      },
      {
        "@type": "Thing",
        name: "PostgreSQL",
        description: "Advanced open-source relational database",
      },
      {
        "@type": "Thing",
        name: "Enterprise Applications",
        description: "Large-scale business software systems",
      },
      {
        "@type": "Thing",
        name: "B2B Software Development",
        description: "Business-to-business application development",
      },
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "Turkey",
      addressRegion: "TR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "professional",
      email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@alptalha.dev",
      url: "https://www.alptalha.dev/#contact",
      availableLanguage: ["English", "Turkish", "Spanish"],
    },
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "Computer Science Education",
    },
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "degree",
        competencyRequired: "Software Development",
        educationalLevel: "Bachelor's Degree",
      },
    ],
    award: [
      "5+ Years Backend Development Experience",
      "Enterprise Application Architecture",
      "Microservices Implementation Expert",
    ],
  };

  // WebSite schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://www.alptalha.dev/#website",
    name: "Alp Talha Yazar - Portfolio",
    description:
      "Professional portfolio showcasing backend development expertise, projects, and experience",
    url: "https://www.alptalha.dev",
    author: {
      "@id": "https://www.alptalha.dev/#person",
    },
    publisher: {
      "@id": "https://www.alptalha.dev/#person",
    },
    inLanguage: "en-US",
    copyrightYear: new Date().getFullYear(),
    copyrightHolder: {
      "@id": "https://www.alptalha.dev/#person",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://www.alptalha.dev/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  // Professional Service schema
  const professionalServiceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": "https://www.alptalha.dev/#service",
    name: "Backend Development Services",
    description:
      "Professional backend development services specializing in .NET, microservices, and enterprise applications",
    provider: {
      "@id": "https://www.alptalha.dev/#person",
    },
    areaServed: {
      "@type": "Place",
      name: "Worldwide (Remote)",
    },
    serviceType: [
      "Backend Development",
      "API Development",
      "Microservices Architecture",
      "Database Design",
      "System Integration",
      "Technical Consulting",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Development Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: ".NET Backend Development",
            description:
              "Full-stack .NET application development with C# and modern frameworks",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Microservices Architecture",
            description:
              "Design and implementation of scalable microservices systems",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "API Development",
            description:
              "RESTful API design and development with proper documentation",
          },
        },
      ],
    },
  };

  // BreadcrumbList schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.alptalha.dev",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "About",
        item: "https://www.alptalha.dev/#about",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Experience",
        item: "https://www.alptalha.dev/#experience",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Projects",
        item: "https://www.alptalha.dev/#projects",
      },
      {
        "@type": "ListItem",
        position: 5,
        name: "Contact",
        item: "https://www.alptalha.dev/#contact",
      },
    ],
  };

  // Combine all schemas
  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [
      personSchema,
      websiteSchema,
      professionalServiceSchema,
      breadcrumbSchema,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(combinedSchema, null, 0),
      }}
    />
  );
}
