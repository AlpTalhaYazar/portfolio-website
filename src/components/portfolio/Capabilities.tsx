"use client";

import { motion } from "framer-motion";

import type { PortfolioContent } from "@/types/portfolio";

import { SectionLabel } from "./SectionLabel";

interface CapabilitiesProps {
  content: PortfolioContent["capabilities"];
}

export function Capabilities({ content }: CapabilitiesProps) {
  return (
    <section id="skills" className="section-shell border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl">
        <SectionLabel
          number={content.sectionNumber}
          title={content.sectionTitle}
        />

        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[2px]">
          {content.groups.map((group, index) => (
            <motion.article
              key={group.category}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: index * 0.06 }}
              className="surface-card h-full"
            >
              <div className="mb-6 flex items-center gap-3 border-b border-border pb-5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span className="mono-label text-accent">{group.category}</span>
              </div>

              <div className="space-y-3">
                {group.items.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="mt-2 h-1 w-1 rounded-full bg-faint" />
                    <span className="text-base leading-7 text-muted-foreground">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          className="mt-3 flex flex-wrap items-center justify-between gap-5 rounded-[28px] border border-accent/25 bg-accent/10 px-8 py-7"
        >
          <p className="max-w-3xl text-base leading-8 text-foreground">
            {content.callout}
          </p>
          <span className="mono-label text-accent">{content.statLabel}</span>
        </motion.div>
      </div>
    </section>
  );
}
