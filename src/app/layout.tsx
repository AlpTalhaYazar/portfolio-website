import type { Metadata } from "next";
import { headers } from "next/headers";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";

import { PortfolioThemeProvider } from "@/components/portfolio/theme";
import StructuredData from "@/components/utils/StructuredData";
import { portfolioThemeScript } from "@/lib/portfolio/theme-script";
import type { PortfolioLocale } from "@/types/portfolio";

import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.alptalha.dev"),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const localeHeader = headersList.get("x-locale");
  const nonce = headersList.get("x-nonce") ?? undefined;
  const requestLocale: PortfolioLocale =
    localeHeader === "tr" || localeHeader === "es" ? localeHeader : "en";

  return (
    <html lang={requestLocale} className="scroll-smooth" suppressHydrationWarning>
      <head>
        <StructuredData locale={requestLocale} />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#080808" />
        <script
          dangerouslySetInnerHTML={{ __html: portfolioThemeScript }}
          id="portfolio-theme-script"
          nonce={nonce}
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${jetBrainsMono.variable} bg-background text-foreground antialiased`}
      >
        <PortfolioThemeProvider>
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          {children}
        </PortfolioThemeProvider>
      </body>
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ? (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      ) : null}
    </html>
  );
}
