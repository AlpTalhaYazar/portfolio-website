"use client";

import { motion } from "framer-motion";

import type { PortfolioContent } from "@/types/portfolio";

import { SectionLabel } from "./SectionLabel";

interface ExperienceProps {
  content: PortfolioContent["experience"];
}

export function Experience({ content }: ExperienceProps) {
  return (
    <section id="experience" className="section-shell border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl">
        <SectionLabel
          number={content.sectionNumber}
          title={content.sectionTitle}
        />
        <h2 className="mb-14 max-w-2xl text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
          {content.intro}
        </h2>

        <div className="space-y-3">
          {content.items.map((item, index) => (
            <motion.article
              key={item.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: index * 0.06 }}
              className="surface-card"
            >
              <div className="mb-6 flex flex-wrap items-start justify-between gap-6">
                <div>
                  <div className="mb-3 flex items-center gap-3">
                    <span className="mono-label text-accent">{item.number}</span>
                    <div className="h-px w-5 bg-border" />
                  </div>
                  <h3 className="text-2xl font-semibold tracking-[-0.03em] text-foreground">
                    {item.company}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.role}</p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="mono-label text-muted-foreground">{item.period}</p>
                  <p className="mt-2 text-sm text-faint">{item.location}</p>
                </div>
              </div>

              <div className="section-divider" />

              <p className="mb-7 max-w-3xl text-base leading-8 text-muted-foreground">
                {item.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span key={tag} className="accent-chip">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
