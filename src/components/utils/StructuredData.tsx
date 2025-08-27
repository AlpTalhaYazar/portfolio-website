export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Alp Talha Yazar",
    jobTitle: "Backend Developer",
    description:
      "Experienced Backend Developer specializing in .NET, microservices, and B2B/B2G applications",
    url: "https://alptalha.dev",
    sameAs: [
      "https://github.com/alptalhayazar",
      "https://linkedin.com/in/alptalhayazar",
    ],
    worksFor: {
      "@type": "Organization",
      name: "Dias (Atlastek)",
    },
    knowsAbout: [
      ".NET",
      "C#",
      "PostgreSQL",
      "Microservices",
      "TypeScript",
      "React",
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "Turkey",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
