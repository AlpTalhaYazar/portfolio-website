"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

import { siteConfig } from "@/lib/site";
import type { PortfolioHeroContent } from "@/types/portfolio";

interface HeroProps {
  content: PortfolioHeroContent;
}

export function Hero({ content }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden px-5 pb-24 pt-28 sm:px-8"
    >
      <div className="absolute inset-0 shell-grid opacity-50" />

      <div className="pointer-events-none absolute right-10 top-1/2 hidden -translate-y-1/2 lg:flex lg:flex-col lg:items-center lg:gap-4">
        <div className="h-20 w-px bg-border" />
        <span className="mono-label writing-vertical rotate-180 text-muted-foreground">
          {content.availability}
        </span>
        <div className="h-20 w-px bg-border" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 flex items-center gap-3"
        >
          <div className="h-px w-8 bg-accent" />
          <span className="mono-label text-accent">{content.eyebrow}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.08 }}
          className="max-w-5xl text-[clamp(3.5rem,10vw,7rem)] font-bold leading-[0.92] tracking-[-0.06em] text-foreground"
        >
          {content.headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.14 }}
          className="mt-5 mono-label text-muted-foreground"
        >
          {siteConfig.fullName}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.2 }}
          className="mt-8 max-w-xl text-balance text-lg leading-8 text-muted-foreground"
        >
          {content.supportingText}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.28 }}
          className="mt-10 flex flex-wrap gap-3"
        >
          <a href="#projects" className="primary-button">
            {content.primaryCta}
          </a>
          <a href="#contact" className="secondary-button">
            {content.secondaryCta}
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.42 }}
          className="mt-14 flex flex-wrap gap-2"
        >
          {content.techTags.map((tag) => (
            <span key={tag} className="accent-chip">
              {tag}
            </span>
          ))}
        </motion.div>
      </div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="absolute bottom-8 left-1/2 z-10 inline-flex -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
      >
        <span className="mono-label">SCROLL</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
        >
          <ArrowDown size={16} />
        </motion.span>
      </motion.a>
    </section>
  );
}
