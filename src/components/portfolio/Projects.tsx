"use client";

import { motion } from "framer-motion";

import type { PortfolioContent } from "@/types/portfolio";

import { SectionLabel } from "./SectionLabel";

interface ProjectsProps {
  content: PortfolioContent["projects"];
}

export function Projects({ content }: ProjectsProps) {
  return (
    <section id="projects" className="section-shell border-t border-border">
      <div className="mx-auto max-w-6xl">
        <SectionLabel
          number={content.sectionNumber}
          title={content.sectionTitle}
        />
        <h2 className="mb-14 max-w-2xl text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
          {content.intro}
        </h2>

        <div className="grid gap-3 xl:grid-cols-2">
          {content.items.map((item, index) => (
            <motion.article
              key={item.number}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: index * 0.05 }}
              className="surface-card flex h-full flex-col"
            >
              <div className="mb-7 flex items-center justify-between gap-4">
                <span className="mono-label text-accent">{item.number}</span>
                <span className="mono-label text-muted-foreground">
                  {item.company}
                </span>
              </div>

              <h3 className="mb-4 text-2xl font-semibold tracking-[-0.03em] text-foreground">
                {item.name}
              </h3>

              <div className="mb-5 flex flex-wrap gap-2">
                {item.themes.map((theme) => (
                  <span key={theme} className="theme-chip">
                    {theme}
                  </span>
                ))}
              </div>

              <p className="flex-1 text-base leading-8 text-muted-foreground">
                {item.description}
              </p>

              <div className="section-divider mt-7" />

              <div className="mt-6 flex flex-wrap gap-2">
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
