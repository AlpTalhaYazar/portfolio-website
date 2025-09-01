"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import { socialLinks } from "@/lib/data";
import { useTranslation } from "@/lib/i18n";

interface ContactInfoProps {
  className?: string;
}

interface ContactInfoItem {
  icon: React.ReactNode;
  title: string;
  content: string;
  href: string | null;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ className = "" }) => {
  const { t } = useTranslation();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Github":
        return (
          <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        );
      case "Linkedin":
        return (
          <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        );
      case "Mail":
        return <Mail size={20} />;
      default:
        return null;
    }
  };

  const contactInfo: ContactInfoItem[] = [
    {
      icon: <Mail size={20} />,
      title: t.contact.contactInfo.email,
      content: "alptalhayazar@gmail.com",
      href: "mailto:alptalhayazar@gmail.com",
    },
    {
      icon: <MapPin size={20} />,
      title: t.contact.contactInfo.location,
      content: "Turkey",
      href: null,
    },
    {
      icon: <Phone size={20} />,
      title: t.contact.contactInfo.phone,
      content: "+90 555 067 35 96",
      href: "tel:+905550673596",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className={className}
    >
      <div className="space-y-8">
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-6">
            {t.contact.conversationTitle}
          </h3>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            {t.contact.conversationDescription}
          </p>
        </div>

        {/* Contact Details */}
        <div className="space-y-4">
          {contactInfo.map((info, index) => (
            <motion.div
              key={info.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center gap-4"
            >
              <div className="p-3 bg-primary/10 text-primary rounded-lg">
                {info.icon}
              </div>
              <div>
                <h4 className="font-semibold text-foreground">{info.title}</h4>
                {info.href ? (
                  <a
                    href={info.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {info.content}
                  </a>
                ) : (
                  <p className="text-muted-foreground">{info.content}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Social Links */}
        <div>
          <h4 className="font-semibold text-foreground mb-4">
            {t.contact.connectTitle}
          </h4>
          <div className="flex gap-4">
            {socialLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center justify-center w-12 h-12 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                aria-label={link.name}
              >
                {getIcon(link.icon)}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactInfo;
