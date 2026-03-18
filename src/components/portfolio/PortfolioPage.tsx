"use client";

import type { PortfolioContent, PortfolioLocale } from "@/types/portfolio";

import { About } from "./About";
import { Capabilities } from "./Capabilities";
import { ContactSection } from "./ContactSection";
import { Experience } from "./Experience";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { Projects } from "./Projects";

interface PortfolioPageProps {
  content: PortfolioContent;
  locale: PortfolioLocale;
}

export function PortfolioPage({ content, locale }: PortfolioPageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header nav={content.nav} locale={locale} />
      <main id="main-content" tabIndex={-1}>
        <Hero content={content.hero} />
        <About content={content.about} />
        <Experience content={content.experience} />
        <Projects content={content.projects} />
        <Capabilities content={content.capabilities} />
        <ContactSection content={content.contact} />
      </main>
      <Footer content={content.footer} nav={content.nav} />
    </div>
  );
}
