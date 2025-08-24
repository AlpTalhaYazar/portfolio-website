"use client";

import { motion } from "framer-motion";
import { Code, Database, Server, Users } from "lucide-react";
import HologramCard from "@/components/ui/HologramCard";

const About = () => {
  const highlights = [
    {
      icon: <Server size={24} />,
      title: "Backend Expertise",
      description:
        "Specialized in .NET 9, C#, and microservices architecture for scalable enterprise solutions.",
    },
    {
      icon: <Database size={24} />,
      title: "Data Management",
      description:
        "Proficient in PostgreSQL, Redis, Entity Framework Core, and database optimization.",
    },
    {
      icon: <Code size={24} />,
      title: "Full Stack Skills",
      description:
        "Experience with React, Angular, Blazor, TypeScript, and modern web technologies.",
    },
    {
      icon: <Users size={24} />,
      title: "B2B Focus",
      description:
        "Extensive experience building enterprise applications for business-to-business solutions.",
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
            About <span className="gradient-text">Me</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A passionate developer with a journey from backend specialization to
            full-stack mastery
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
              <p className="text-lg text-muted-foreground leading-relaxed">
                I'm a{" "}
                <strong className="text-foreground">Backend Developer</strong>{" "}
                with deep expertise in
                <strong className="text-primary"> .NET ecosystem</strong> and
                modern web technologies. My journey began with a focus on
                backend systems, but I've evolved into a full-stack engineer who
                understands the complete development lifecycle.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Throughout my career, I've specialized in building{" "}
                <strong className="text-primary">
                  B2B/B2G enterprise applications
                </strong>
                that serve real business needs. From chatbot platforms to AI
                infrastructure, and from alcohol tracking systems to fuel
                management solutions, I've consistently delivered scalable and
                reliable software.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                I'm passionate about{" "}
                <strong className="text-primary">
                  microservices architecture
                </strong>
                , clean code principles, and staying current with emerging
                technologies. My approach combines technical excellence with
                business understanding to create solutions that not only work
                well but also drive business value.
              </p>

              <div className="pt-4">
                <h3 className="text-xl font-semibold mb-4 text-foreground">
                  What I Bring
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    4~ years of professional development experience
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Deep expertise in .NET, Entity Framework, and SQL databases
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Experience with Docker, Kubernetes, and cloud technologies
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Strong foundation in frontend technologies (React, Angular,
                    Blazor)
                  </li>
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
