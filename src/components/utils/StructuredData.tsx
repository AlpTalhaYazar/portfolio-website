export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: process.env.NEXT_PUBLIC_FULL_NAME || "",
    jobTitle: process.env.NEXT_PUBLIC_JOB_TITLE || "",
    description:
      "Experienced Backend Developer specializing in .NET, microservices, and B2B/B2G applications",
    url: process.env.NEXT_PUBLIC_BASE_URL || "",
    sameAs: [
      process.env.NEXT_PUBLIC_GITHUB_URL || "",
      process.env.NEXT_PUBLIC_LINKEDIN_URL || "",
    ],
    worksFor: {
      "@type": "Organization",
      name: process.env.NEXT_PUBLIC_COMPANY || "",
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
      addressCountry: process.env.NEXT_PUBLIC_CONTACT_LOCATION || "",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
