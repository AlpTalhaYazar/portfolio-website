import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import StructuredData from "@/components/StructuredData";
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
  metadataBase: new URL("https://your-domain.com"), // TODO: Update with actual domain
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Alp Talha Yazar - Backend Developer",
    description:
      "Experienced Backend Developer specializing in .NET, microservices, and B2B/B2G applications.",
    type: "website",
    locale: "en_US",
    url: "https://your-domain.com", // TODO: Update with actual domain
    siteName: "Alp Talha Yazar Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alp Talha Yazar - Backend Developer",
    description:
      "Experienced Backend Developer specializing in .NET, microservices, and B2B/B2G applications.",
    creator: "@your_twitter_handle", // TODO: Update with actual Twitter handle
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
    google: "your-google-verification-code", // Add your Google Search Console verification code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <StructuredData />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
