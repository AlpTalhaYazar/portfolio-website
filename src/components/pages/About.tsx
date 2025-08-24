"use client";

import { motion } from "framer-motion";
import { Code, Database, Server, Users } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import HologramCard from "@/components/ui/HologramCard";

const About = () => {
  const { t } = useTranslation();

  const highlights = [
    {
      icon: <Server size={24} />,
      title: t.about.highlights.backendExpertise.title,
      description: t.about.highlights.backendExpertise.description,
    },
    {
      icon: <Database size={24} />,
      title: t.about.highlights.dataManagement.title,
      description: t.about.highlights.dataManagement.description,
    },
    {
      icon: <Code size={24} />,
      title: t.about.highlights.fullStackSkills.title,
      description: t.about.highlights.fullStackSkills.description,
    },
    {
      icon: <Users size={24} />,
      title: t.about.highlights.b2bFocus.title,
      description: t.about.highlights.b2bFocus.description,
    },
  ];

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t.about.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.about.subtitle}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Text content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="space-y-6">
              {(t.about.description as string[]).map((paragraph, index) => (
                <p
                  key={index}
                  className="text-lg text-muted-foreground leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}

              <div className="pt-4">
                <h3 className="text-xl font-semibold mb-4 text-foreground">
                  {t.about.whatIBring}
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  {(t.about.experience as string[]).map((item, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Right column - Highlights cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {highlights.map((highlight, index) => (
              <HologramCard
                key={highlight.title}
                variant="bordered"
                className="p-6"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-primary/10 text-primary rounded-lg">
                      {highlight.icon}
                    </div>
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">
                    {highlight.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {highlight.description}
                  </p>
                </motion.div>
              </HologramCard>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
