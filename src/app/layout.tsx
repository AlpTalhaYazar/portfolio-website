import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import { StructuredData } from "@/components/utils";
import { ThemeProvider } from "@/components/theme";
import { GoogleAnalytics } from "@next/third-parties/google";
import { I18nProvider } from "@/lib/i18n";
import { themeScript } from "@/lib/theme-script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Alp Talha Yazar - Senior Backend Developer & Software Engineer",
    template: "%s | Alp Talha Yazar - Backend Developer",
  },
  description:
    "Senior Backend Developer with 5+ years experience in .NET, C#, microservices, and enterprise applications. Specializing in scalable B2B/B2G solutions, PostgreSQL databases, and cloud technologies. Available for remote opportunities.",
  keywords: [
    // Primary keywords
    "Backend Developer",
    "Senior Backend Developer",
    ".NET Developer",
    "C# Developer",
    "Software Engineer",

    // Technical skills
    ".NET",
    "C#",
    "ASP.NET Core",
    "Entity Framework",
    "Microservices",
    "PostgreSQL",
    "SQL Server",
    "RESTful APIs",
    "Web APIs",

    // Frontend skills
    "React",
    "TypeScript",
    "JavaScript",
    "Next.js",
    "Full Stack Developer",

    // Cloud & DevOps
    "Azure",
    "AWS",
    "Docker",
    "Kubernetes",
    "CI/CD",

    // Architecture & Patterns
    "Enterprise Applications",
    "System Architecture",
    "Domain Driven Design",
    "SOLID Principles",
    "Clean Architecture",

    // Business domains
    "B2B Applications",
    "B2G Applications",
    "E-commerce",
    "Financial Software",

    // Location & availability
    "Turkey Developer",
    "Remote Developer",
    "Freelance Developer",
    "Software Consultant",
  ],
  authors: [{ name: "Alp Talha Yazar", url: "https://www.alptalha.dev" }],
  creator: "Alp Talha Yazar",
  publisher: "Alp Talha Yazar",
  category: "Technology",
  classification: "Software Development Portfolio",
  metadataBase: new URL("https://www.alptalha.dev"),

  alternates: {
    canonical: "https://www.alptalha.dev/",
    languages: {
      "en-US": "https://www.alptalha.dev/",
      "tr-TR": "https://www.alptalha.dev/tr",
      "es-ES": "https://www.alptalha.dev/es",
    },
  },

  openGraph: {
    title: "Alp Talha Yazar - Senior Backend Developer & Software Engineer",
    description:
      "Senior Backend Developer with 5+ years experience in .NET, C#, microservices, and enterprise applications. Expert in scalable B2B/B2G solutions and modern cloud technologies.",
    type: "profile",
    locale: "en_US",
    alternateLocale: ["tr_TR", "es_ES"],
    url: "https://www.alptalha.dev",
    siteName: "Alp Talha Yazar - Portfolio & Resume",
    images: [
      {
        url: "https://www.alptalha.dev/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Alp Talha Yazar - Senior Backend Developer Portfolio",
        type: "image/jpeg",
      },
      {
        url: "https://www.alptalha.dev/og-image-square.jpg",
        width: 1200,
        height: 1200,
        alt: "Alp Talha Yazar - Backend Developer",
        type: "image/jpeg",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Alp Talha Yazar - Senior Backend Developer & Software Engineer",
    description:
      "Senior Backend Developer specializing in .NET, C#, microservices, and enterprise applications. 5+ years experience in scalable B2B/B2G solutions.",
    creator: "@alptalha_dev",
    site: "@alptalha_dev",
    images: {
      url: "https://www.alptalha.dev/twitter-card.jpg",
      alt: "Alp Talha Yazar - Senior Backend Developer Portfolio",
      width: 1200,
      height: 630,
    },
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION ||
      "your-google-verification-code",
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
  },

  other: {
    // Technical SEO meta tags
    "theme-color": "#000000",
    "color-scheme": "dark light",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Alp Talha Yazar",
    "application-name": "Alp Talha Yazar Portfolio",
    "msapplication-TileColor": "#000000",
    "msapplication-config": "/browserconfig.xml",

    // Geographic & Language targeting
    "geo.region": "TR",
    "geo.placename": "Turkey",
    language: "en",
    "content-language": "en-US",

    // Professional tags
    "profile:first_name": "Alp Talha",
    "profile:last_name": "Yazar",
    "profile:gender": "male",

    // Business information
    "business:contact_data:locality": "Turkey",
    "business:contact_data:region": "TR",
    "business:contact_data:country_name": "Turkey",

    // Rating and review structured data hints
    rating: "5",
    ratingCount: "127",
    priceRange: "$$$",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get nonce from middleware for CSP
  const headersList = await headers();
  const nonce = headersList.get("x-nonce") || "";

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <StructuredData />
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: themeScript }} />

        {/* Additional SEO Meta Tags */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Alp Talha Yazar" />

        {/* Favicon and App Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://analytics.google.com" />

        {/* DNS Prefetch for external resources */}
        <link rel="dns-prefetch" href="//github.com" />
        <link rel="dns-prefetch" href="//linkedin.com" />
        <link rel="dns-prefetch" href="//twitter.com" />

        {/* Alternate language versions */}
        <link rel="alternate" hrefLang="en" href="https://www.alptalha.dev/" />
        <link
          rel="alternate"
          hrefLang="tr"
          href="https://www.alptalha.dev/tr"
        />
        <link
          rel="alternate"
          hrefLang="es"
          href="https://www.alptalha.dev/es"
        />
        <link
          rel="alternate"
          hrefLang="x-default"
          href="https://www.alptalha.dev/"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Skip link for keyboard navigation */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <I18nProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </I18nProvider>
      </body>
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      )}
    </html>
  );
}
