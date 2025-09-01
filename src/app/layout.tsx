import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { StructuredData } from "@/components/utils";
import { ThemeProvider } from "@/components/theme";
import { GoogleAnalytics } from "@/components/analytics";
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
    default: "Alp Talha Yazar - Backend Developer",
    template: "%s | Alp Talha Yazar",
  },
  description:
    "Experienced Backend Developer specializing in .NET, microservices, and B2B/B2G applications. Expert in C#, Entity Framework, PostgreSQL, and modern cloud technologies.",
  keywords: [
    "Backend Developer",
    ".NET",
    "C#",
    "Microservices",
    "PostgreSQL",
    "React",
    "TypeScript",
    "Full Stack",
    "Enterprise Applications",
    "Software Engineering",
    "Turkey Developer",
  ],
  authors: [{ name: "Alp Talha Yazar" }],
  creator: "Alp Talha Yazar",
  publisher: "Alp Talha Yazar",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || ""),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Alp Talha Yazar - Backend Developer",
    description:
      "Experienced Backend Developer specializing in .NET, microservices, and B2B/B2G applications.",
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_BASE_URL || "",
    siteName: "Alp Talha Yazar Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alp Talha Yazar - Backend Developer",
    description:
      "Experienced Backend Developer specializing in .NET, microservices, and B2B/B2G applications.",
    creator:
      `@${process.env.NEXT_PUBLIC_TWITTER_HANDLE}` || "@your_twitter_handle",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION ||
      "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <StructuredData />
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics
            measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
          />
        )}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
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
    </html>
  );
}
