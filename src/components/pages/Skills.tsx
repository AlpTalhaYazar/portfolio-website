"use client";

import { motion } from "framer-motion";
import { skills } from "@/lib/data";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const Skills = () => {
  const { effectiveTheme } = useTheme();
  const { t } = useTranslation();

  const skillCategories = {
    backend: { name: t.skills.categories.backend },
    frontend: { name: t.skills.categories.frontend },
    database: { name: t.skills.categories.database },
    tools: { name: t.skills.categories.tools },
  };

  const proficiencyLevels = {
    expert: {
      name: t.skills.proficiency.expert,
      indicator: "●●●●",
      description: "Advanced",
    },
    proficient: {
      name: t.skills.proficiency.proficient,
      indicator: "●●●○",
      description: "Proficient",
    },
    intermediate: {
      name: t.skills.proficiency.intermediate,
      indicator: "●●○○",
      description: "Intermediate",
    },
    basic: {
      name: t.skills.proficiency.basic,
      indicator: "●○○○",
      description: "Basic",
    },
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  return (
    <section
      id="skills"
      className={cn(
        "py-20",
        effectiveTheme === "matrix" ? "bg-muted/30" : "bg-muted/10"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t.skills.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.skills.subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-background rounded-lg p-6 shadow-sm border border-border/50"
            >
              <h3 className="text-lg font-semibold text-foreground mb-6 pb-2 border-b border-border/30">
                {skillCategories[category as keyof typeof skillCategories].name}
              </h3>

              <div className="space-y-3">
                {categorySkills.map((skill) => (
                  <div
                    key={skill.name}
                    className="flex items-center justify-between py-1"
                  >
                    <span className="text-sm font-medium text-foreground">
                      {skill.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs text-muted-foreground/80 font-mono tracking-wider"
                        aria-hidden="true"
                        title={proficiencyLevels[skill.proficiency].description}
                      >
                        {proficiencyLevels[skill.proficiency].indicator}
                      </span>
                      <span className="sr-only">
                        {proficiencyLevels[skill.proficiency].name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Subtle proficiency guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-muted-foreground/60">
            {t.skills.legend}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
