"use client";

import { motion } from "framer-motion";
import {
  ExternalLink,
  Building2,
  User,
  CheckCircle,
  Clock,
} from "lucide-react";
import { projects } from "@/lib/data";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import HologramCard from "@/components/ui/HologramCard";
import LightsaberButton from "@/components/ui/LightsaberButton";

const Projects = () => {
  const { effectiveTheme } = useTheme();
  const { t } = useTranslation();

  const getStatusIcon = (status: string) => {
    return status === "active" ? (
      <Clock size={16} className="text-blue-500" />
    ) : (
      <CheckCircle size={16} className="text-green-500" />
    );
  };

  const getStatusText = (status: string) => {
    return status === "active"
      ? t.projects.status.active
      : t.projects.status.completed;
  };

  const getStatusColor = (status: string) => {
    // Use semantic colors that adapt to all themes
    return status === "active"
      ? "bg-primary/10 text-primary border-primary/30"
      : "bg-accent text-accent-foreground border-border";
  };

  return (
    <section
      id="projects"
      className={cn(
        "py-20",
        effectiveTheme === "matrix"
          ? "bg-muted/30"
          : effectiveTheme === "starwars"
          ? "bg-transparent"
          : "bg-background"
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
            {t.projects.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.projects.subtitle}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <HologramCard
              key={project.id}
              variant={project.status === "active" ? "glowing" : "bordered"}
              className="overflow-hidden"
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                {/* Header */}
                <div className="p-6 border-b border-border">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-foreground">
                      {project.name}
                    </h3>
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {getStatusIcon(project.status)}
                      {getStatusText(project.status)}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Building2 size={14} />
                      {project.company}
                    </div>
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      {project.role}
                    </div>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Key Features */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-foreground mb-3">
                      {t.projects.features}:
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {project.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle
                            size={14}
                            className="text-primary mt-0.5 flex-shrink-0"
                          />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technologies */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">
                      {t.projects.technologies}:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded-full font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6">
                  <div className="border-t border-border pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Enterprise{" "}
                        {
                          t.projects.type[
                            project.type.toLowerCase() as keyof typeof t.projects.type
                          ]
                        }{" "}
                        Application
                      </span>
                      {project.status === "completed" && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <ExternalLink size={14} />
                          <span>Portfolio Project</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </HologramCard>
          ))}
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-6">
            {t.contact.projectsQuestion}
          </p>
          <LightsaberButton
            variant="purple"
            onClick={() => {
              const contactSection = document.querySelector("#contact");
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            {t.projects.viewDetails}
          </LightsaberButton>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
