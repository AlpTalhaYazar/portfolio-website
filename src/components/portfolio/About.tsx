"use client";

import { motion } from "framer-motion";

import { socialLinks } from "@/lib/site";
import type { PortfolioAboutContent } from "@/types/portfolio";

import { SectionLabel } from "./SectionLabel";

interface AboutProps {
  content: PortfolioAboutContent;
}

export function About({ content }: AboutProps) {
  return (
    <section id="about" className="section-shell border-t border-border">
      <div className="mx-auto max-w-6xl">
        <SectionLabel
          number={content.sectionNumber}
          title={content.sectionTitle}
        />

        <div className="grid gap-16 lg:grid-cols-[1.1fr_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="space-y-10"
          >
            <h2 className="max-w-xl text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl">
              {content.lead}
            </h2>
            <div className="h-0.5 w-10 bg-accent" />
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="secondary-button"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {content.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-lg leading-8 text-muted-foreground">
                {paragraph}
              </p>
            ))}

            <div className="inline-flex items-center gap-3 rounded-full border border-border bg-surface px-5 py-3">
              <span className="h-2 w-2 rounded-full bg-accent" />
              <span className="mono-label text-foreground">{content.statusPill}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
