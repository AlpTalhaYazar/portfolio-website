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
    backend: { name: t.skills.categories.backend, color: "bg-blue-500" },
    frontend: { name: t.skills.categories.frontend, color: "bg-green-500" },
    database: { name: t.skills.categories.database, color: "bg-purple-500" },
    tools: { name: t.skills.categories.tools, color: "bg-orange-500" },
  };

  const proficiencyLevels = {
    expert: {
      name: t.skills.proficiency.expert,
      percentage: 90,
      color: "bg-green-500",
    },
    proficient: {
      name: t.skills.proficiency.proficient,
      percentage: 75,
      color: "bg-blue-500",
    },
    intermediate: {
      name: t.skills.proficiency.intermediate,
      percentage: 60,
      color: "bg-yellow-500",
    },
    basic: {
      name: t.skills.proficiency.basic,
      percentage: 40,
      color: "bg-gray-500",
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.entries(groupedSkills).map(
            ([category, categorySkills], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                viewport={{ once: true }}
                className="bg-background rounded-lg p-6 shadow-sm border border-border"
              >
                <div className="flex items-center mb-6">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      skillCategories[category as keyof typeof skillCategories]
                        .color
                    } mr-3`}
                  ></div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {
                      skillCategories[category as keyof typeof skillCategories]
                        .name
                    }
                  </h3>
                </div>

                <div className="space-y-4">
                  {categorySkills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: categoryIndex * 0.1 + skillIndex * 0.05,
                      }}
                      viewport={{ once: true }}
                      className="relative"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-foreground">
                          {skill.name}
                        </span>
                        <span className="text-xs text-muted-foreground capitalize">
                          {skill.proficiency}
                        </span>
                      </div>

                      <div className="w-full bg-secondary rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{
                            width: `${
                              proficiencyLevels[skill.proficiency].percentage
                            }%`,
                          }}
                          transition={{
                            duration: 1,
                            delay: categoryIndex * 0.2 + skillIndex * 0.1,
                          }}
                          viewport={{ once: true }}
                          className={`h-2 rounded-full ${
                            proficiencyLevels[skill.proficiency].color
                          }`}
                        ></motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )
          )}
        </div>

        {/* Proficiency Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <h4 className="text-lg font-semibold text-foreground mb-4">
            Proficiency Levels
          </h4>
          <div className="flex flex-wrap justify-center gap-6">
            {Object.entries(proficiencyLevels).map(([level, config]) => (
              <div key={level} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded ${config.color}`}></div>
                <span className="text-sm text-muted-foreground">
                  {config.name} ({config.percentage}%+)
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
