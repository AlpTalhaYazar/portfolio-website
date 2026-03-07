"use client";

import { motion } from "framer-motion";

import { contactDetails } from "@/lib/site";
import type { PortfolioContactContent } from "@/types/portfolio";

import { ContactForm } from "./ContactForm";
import { SectionLabel } from "./SectionLabel";

interface ContactSectionProps {
  content: PortfolioContactContent;
}

export function ContactSection({ content }: ContactSectionProps) {
  return (
    <section id="contact" className="section-shell border-t border-border">
      <div className="mx-auto max-w-6xl">
        <SectionLabel
          number={content.sectionNumber}
          title={content.sectionTitle}
        />

        <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="space-y-8"
          >
            <div className="space-y-5">
              <h2 className="max-w-xl text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl">
                {content.headline}
              </h2>
              <p className="text-lg leading-8 text-muted-foreground">
                {content.intro}
              </p>
              <p className="max-w-xl text-base leading-8 text-muted-foreground">
                {content.body}
              </p>
            </div>

            <div className="space-y-4">
              {contactDetails.map((detail) => (
                <a
                  key={detail.label}
                  href={detail.href}
                  target={detail.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={detail.href.startsWith("mailto:") ? undefined : "noreferrer"}
                  className="flex items-center justify-between rounded-2xl border border-border bg-surface px-5 py-4 transition-colors hover:border-border-strong"
                >
                  <span className="mono-label text-muted-foreground">
                    {detail.label}
                  </span>
                  <span className="text-sm text-foreground">↗</span>
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.08 }}
          >
            <ContactForm content={content.form} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
