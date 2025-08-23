export interface Experience {
  id: string;
  company: string;
  position: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
  technologies: string[];
  type: "current" | "previous";
}

export interface Project {
  id: string;
  name: string;
  type: "B2B" | "B2G";
  description: string;
  technologies: string[];
  features: string[];
  role: string;
  company: string;
  status: "active" | "completed";
}

export interface Skill {
  name: string;
  category: "backend" | "frontend" | "database" | "tools" | "languages";
  proficiency: "expert" | "proficient" | "intermediate" | "basic";
  icon?: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}
